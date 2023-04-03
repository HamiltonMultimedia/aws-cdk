"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cfn_resource_1 = require("../lib/cfn-resource");
const tag_manager_1 = require("../lib/tag-manager");
describe('tag manager', () => {
    test('TagManagerOptions can set tagPropertyName', () => {
        const tagPropName = 'specialName';
        const mgr = new tag_manager_1.TagManager(cfn_resource_1.TagType.MAP, 'Foo', undefined, { tagPropertyName: tagPropName });
        expect(mgr.tagPropertyName).toEqual(tagPropName);
    });
    test('#setTag() supports setting a tag regardless of Type', () => {
        const notTaggable = new tag_manager_1.TagManager(cfn_resource_1.TagType.NOT_TAGGABLE, 'AWS::Resource::Type');
        notTaggable.setTag('key', 'value');
        expect(notTaggable.renderTags()).toEqual(undefined);
    });
    describe('when a tag does not exist', () => {
        test('#removeTag() does not throw an error', () => {
            const mgr = new tag_manager_1.TagManager(cfn_resource_1.TagType.STANDARD, 'AWS::Resource::Type');
            expect(() => (mgr.removeTag('dne', 0))).not.toThrow();
        });
        test('#setTag() creates the tag', () => {
            const mgr = new tag_manager_1.TagManager(cfn_resource_1.TagType.STANDARD, 'AWS::Resource::Type');
            mgr.setTag('dne', 'notanymore');
            expect(mgr.renderTags()).toEqual([{ key: 'dne', value: 'notanymore' }]);
        });
    });
    describe('when a tag does exist', () => {
        test('#removeTag() deletes the tag', () => {
            const mgr = new tag_manager_1.TagManager(cfn_resource_1.TagType.STANDARD, 'AWS::Resource::Type');
            mgr.setTag('dne', 'notanymore', 0);
            mgr.removeTag('dne', 0);
            expect(mgr.renderTags()).toEqual(undefined);
        });
        test('#setTag() overwrites the tag', () => {
            const mgr = new tag_manager_1.TagManager(cfn_resource_1.TagType.STANDARD, 'AWS::Resource::Type');
            mgr.setTag('dne', 'notanymore');
            mgr.setTag('dne', 'iwin');
            expect(mgr.renderTags()).toEqual([{ key: 'dne', value: 'iwin' }]);
        });
    });
    describe('when there are no tags', () => {
        test('#renderTags() returns undefined', () => {
            const mgr = new tag_manager_1.TagManager(cfn_resource_1.TagType.STANDARD, 'AWS::Resource::Type');
            expect(mgr.renderTags()).toEqual(undefined);
        });
        test('#hasTags() returns false', () => {
            const mgr = new tag_manager_1.TagManager(cfn_resource_1.TagType.STANDARD, 'AWS::Resource::Type');
            expect(mgr.hasTags()).toEqual(false);
        });
    });
    test('#renderTags() handles standard, map, keyValue, and ASG tag formats', () => {
        const tagged = [];
        const standard = new tag_manager_1.TagManager(cfn_resource_1.TagType.STANDARD, 'AWS::Resource::Type');
        const asg = new tag_manager_1.TagManager(cfn_resource_1.TagType.AUTOSCALING_GROUP, 'AWS::Resource::Type');
        const keyValue = new tag_manager_1.TagManager(cfn_resource_1.TagType.KEY_VALUE, 'AWS::Resource::Type');
        const mapper = new tag_manager_1.TagManager(cfn_resource_1.TagType.MAP, 'AWS::Resource::Type');
        tagged.push(standard);
        tagged.push(asg);
        tagged.push(keyValue);
        tagged.push(mapper);
        for (const res of tagged) {
            res.setTag('foo', 'bar');
            res.setTag('asg', 'only', 0, false);
        }
        expect(standard.renderTags()).toEqual([
            { key: 'asg', value: 'only' },
            { key: 'foo', value: 'bar' },
        ]);
        expect(asg.renderTags()).toEqual([
            { key: 'asg', value: 'only', propagateAtLaunch: false },
            { key: 'foo', value: 'bar', propagateAtLaunch: true },
        ]);
        expect(keyValue.renderTags()).toEqual([
            { Key: 'asg', Value: 'only' },
            { Key: 'foo', Value: 'bar' },
        ]);
        expect(mapper.renderTags()).toEqual({
            foo: 'bar',
            asg: 'only',
        });
    });
    test('when there are tags it hasTags returns true', () => {
        const mgr = new tag_manager_1.TagManager(cfn_resource_1.TagType.STANDARD, 'AWS::Resource::Type');
        mgr.setTag('key', 'myVal', 2);
        mgr.setTag('key', 'newVal', 1);
        expect(mgr.hasTags()).toEqual(true);
    });
    test('tags with higher or equal priority always take precedence', () => {
        const mgr = new tag_manager_1.TagManager(cfn_resource_1.TagType.STANDARD, 'AWS::Resource::Type');
        mgr.setTag('key', 'myVal', 2);
        mgr.setTag('key', 'newVal', 1);
        expect(mgr.renderTags()).toEqual([
            { key: 'key', value: 'myVal' },
        ]);
        mgr.removeTag('key', 1);
        expect(mgr.renderTags()).toEqual([
            { key: 'key', value: 'myVal' },
        ]);
        mgr.removeTag('key', 2);
        expect(mgr.renderTags()).toEqual(undefined);
    });
    test('tags are always ordered by key name', () => {
        const mgr = new tag_manager_1.TagManager(cfn_resource_1.TagType.STANDARD, 'AWS::Resource::Type');
        mgr.setTag('key', 'foo');
        mgr.setTag('aardvark', 'zebra');
        mgr.setTag('name', 'test');
        expect(mgr.renderTags()).toEqual([
            { key: 'aardvark', value: 'zebra' },
            { key: 'key', value: 'foo' },
            { key: 'name', value: 'test' },
        ]);
        mgr.setTag('myKey', 'myVal');
        expect(mgr.renderTags()).toEqual([
            { key: 'aardvark', value: 'zebra' },
            { key: 'key', value: 'foo' },
            { key: 'myKey', value: 'myVal' },
            { key: 'name', value: 'test' },
        ]);
    });
    test('excludeResourceTypes only tags resources that do not match', () => {
        const mgr = new tag_manager_1.TagManager(cfn_resource_1.TagType.STANDARD, 'AWS::Fake::Resource');
        expect(false).toEqual(mgr.applyTagAspectHere([], ['AWS::Fake::Resource']));
        expect(true).toEqual(mgr.applyTagAspectHere([], ['AWS::Wrong::Resource']));
    });
    test('includeResourceTypes only tags resources that match', () => {
        const mgr = new tag_manager_1.TagManager(cfn_resource_1.TagType.STANDARD, 'AWS::Fake::Resource');
        expect(true).toEqual(mgr.applyTagAspectHere(['AWS::Fake::Resource'], []));
        expect(false).toEqual(mgr.applyTagAspectHere(['AWS::Wrong::Resource'], []));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLW1hbmFnZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhZy1tYW5hZ2VyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzREFBOEM7QUFDOUMsb0RBQWdEO0FBRWhELFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzNCLElBQUksQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7UUFDckQsTUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLElBQUksd0JBQVUsQ0FBQyxzQkFBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFFNUYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1FBQy9ELE1BQU0sV0FBVyxHQUFHLElBQUksd0JBQVUsQ0FBQyxzQkFBTyxDQUFDLFlBQVksRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2hGLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO1FBQ3pDLElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7WUFDaEQsTUFBTSxHQUFHLEdBQUcsSUFBSSx3QkFBVSxDQUFDLHNCQUFPLENBQUMsUUFBUSxFQUFFLHFCQUFxQixDQUFDLENBQUM7WUFDcEUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFNB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MUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRhZ1R5cGUgfSBmcm9tICcuLi9saWIvY2ZuLXJlc291cmNlJztcbmltcG9ydCB7IFRhZ01hbmFnZXIgfSBmcm9tICcuLi9saWIvdGFnLW1hbmFnZXInO1xuXG5kZXNjcmliZSgndGFnIG1hbmFnZXInLCAoKSA9PiB7XG4gIHRlc3QoJ1RhZ01hbmFnZXJPcHRpb25zIGNhbiBzZXQgdGFnUHJvcGVydHlOYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IHRhZ1Byb3BOYW1lID0gJ3NwZWNpYWxOYW1lJztcbiAgICBjb25zdCBtZ3IgPSBuZXcgVGFnTWFuYWdlcihUYWdUeXBlLk1BUCwgJ0ZvbycsIHVuZGVmaW5lZCwgeyB0YWdQcm9wZXJ0eU5hbWU6IHRhZ1Byb3BOYW1lIH0pO1xuXG4gICAgZXhwZWN0KG1nci50YWdQcm9wZXJ0eU5hbWUpLnRvRXF1YWwodGFnUHJvcE5hbWUpO1xuICB9KTtcblxuICB0ZXN0KCcjc2V0VGFnKCkgc3VwcG9ydHMgc2V0dGluZyBhIHRhZyByZWdhcmRsZXNzIG9mIFR5cGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgbm90VGFnZ2FibGUgPSBuZXcgVGFnTWFuYWdlcihUYWdUeXBlLk5PVF9UQUdHQUJMRSwgJ0FXUzo6UmVzb3VyY2U6OlR5cGUnKTtcbiAgICBub3RUYWdnYWJsZS5zZXRUYWcoJ2tleScsICd2YWx1ZScpO1xuICAgIGV4cGVjdChub3RUYWdnYWJsZS5yZW5kZXJUYWdzKCkpLnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gYSB0YWcgZG9lcyBub3QgZXhpc3QnLCAoKSA9PiB7XG4gICAgdGVzdCgnI3JlbW92ZVRhZygpIGRvZXMgbm90IHRocm93IGFuIGVycm9yJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWdyID0gbmV3IFRhZ01hbmFnZXIoVGFnVHlwZS5TVEFOREFSRCwgJ0FXUzo6UmVzb3VyY2U6OlR5cGUnKTtcbiAgICAgIGV4cGVjdCgoKSA9PiAobWdyLnJlbW92ZVRhZygnZG5lJywgMCkpKS5ub3QudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnI3NldFRhZygpIGNyZWF0ZXMgdGhlIHRhZycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1nciA9IG5ldyBUYWdNYW5hZ2VyKFRhZ1R5cGUuU1RBTkRBUkQsICdBV1M6OlJlc291cmNlOjpUeXBlJyk7XG4gICAgICBtZ3Iuc2V0VGFnKCdkbmUnLCAnbm90YW55bW9yZScpO1xuICAgICAgZXhwZWN0KG1nci5yZW5kZXJUYWdzKCkpLnRvRXF1YWwoW3sga2V5OiAnZG5lJywgdmFsdWU6ICdub3Rhbnltb3JlJyB9XSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIGEgdGFnIGRvZXMgZXhpc3QnLCAoKSA9PiB7XG4gICAgdGVzdCgnI3JlbW92ZVRhZygpIGRlbGV0ZXMgdGhlIHRhZycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1nciA9IG5ldyBUYWdNYW5hZ2VyKFRhZ1R5cGUuU1RBTkRBUkQsICdBV1M6OlJlc291cmNlOjpUeXBlJyk7XG4gICAgICBtZ3Iuc2V0VGFnKCdkbmUnLCAnbm90YW55bW9yZScsIDApO1xuICAgICAgbWdyLnJlbW92ZVRhZygnZG5lJywgMCk7XG4gICAgICBleHBlY3QobWdyLnJlbmRlclRhZ3MoKSkudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnI3NldFRhZygpIG92ZXJ3cml0ZXMgdGhlIHRhZycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1nciA9IG5ldyBUYWdNYW5hZ2VyKFRhZ1R5cGUuU1RBTkRBUkQsICdBV1M6OlJlc291cmNlOjpUeXBlJyk7XG4gICAgICBtZ3Iuc2V0VGFnKCdkbmUnLCAnbm90YW55bW9yZScpO1xuICAgICAgbWdyLnNldFRhZygnZG5lJywgJ2l3aW4nKTtcbiAgICAgIGV4cGVjdChtZ3IucmVuZGVyVGFncygpKS50b0VxdWFsKFt7IGtleTogJ2RuZScsIHZhbHVlOiAnaXdpbicgfV0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hlbiB0aGVyZSBhcmUgbm8gdGFncycsICgpID0+IHtcbiAgICB0ZXN0KCcjcmVuZGVyVGFncygpIHJldHVybnMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWdyID0gbmV3IFRhZ01hbmFnZXIoVGFnVHlwZS5TVEFOREFSRCwgJ0FXUzo6UmVzb3VyY2U6OlR5cGUnKTtcbiAgICAgIGV4cGVjdChtZ3IucmVuZGVyVGFncygpKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCcjaGFzVGFncygpIHJldHVybnMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtZ3IgPSBuZXcgVGFnTWFuYWdlcihUYWdUeXBlLlNUQU5EQVJELCAnQVdTOjpSZXNvdXJjZTo6VHlwZScpO1xuICAgICAgZXhwZWN0KG1nci5oYXNUYWdzKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCcjcmVuZGVyVGFncygpIGhhbmRsZXMgc3RhbmRhcmQsIG1hcCwga2V5VmFsdWUsIGFuZCBBU0cgdGFnIGZvcm1hdHMnLCAoKSA9PiB7XG4gICAgY29uc3QgdGFnZ2VkOiBUYWdNYW5hZ2VyW10gPSBbXTtcbiAgICBjb25zdCBzdGFuZGFyZCA9IG5ldyBUYWdNYW5hZ2VyKFRhZ1R5cGUuU1RBTkRBUkQsICdBV1M6OlJlc291cmNlOjpUeXBlJyk7XG4gICAgY29uc3QgYXNnID0gbmV3IFRhZ01hbmFnZXIoVGFnVHlwZS5BVVRPU0NBTElOR19HUk9VUCwgJ0FXUzo6UmVzb3VyY2U6OlR5cGUnKTtcbiAgICBjb25zdCBrZXlWYWx1ZSA9IG5ldyBUYWdNYW5hZ2VyKFRhZ1R5cGUuS0VZX1ZBTFVFLCAnQVdTOjpSZXNvdXJjZTo6VHlwZScpO1xuICAgIGNvbnN0IG1hcHBlciA9IG5ldyBUYWdNYW5hZ2VyKFRhZ1R5cGUuTUFQLCAnQVdTOjpSZXNvdXJjZTo6VHlwZScpO1xuICAgIHRhZ2dlZC5wdXNoKHN0YW5kYXJkKTtcbiAgICB0YWdnZWQucHVzaChhc2cpO1xuICAgIHRhZ2dlZC5wdXNoKGtleVZhbHVlKTtcbiAgICB0YWdnZWQucHVzaChtYXBwZXIpO1xuICAgIGZvciAoY29uc3QgcmVzIG9mIHRhZ2dlZCkge1xuICAgICAgcmVzLnNldFRhZygnZm9vJywgJ2JhcicpO1xuICAgICAgcmVzLnNldFRhZygnYXNnJywgJ29ubHknLCAwLCBmYWxzZSk7XG4gICAgfVxuICAgIGV4cGVjdChzdGFuZGFyZC5yZW5kZXJUYWdzKCkpLnRvRXF1YWwoW1xuICAgICAgeyBrZXk6ICdhc2cnLCB2YWx1ZTogJ29ubHknIH0sXG4gICAgICB7IGtleTogJ2ZvbycsIHZhbHVlOiAnYmFyJyB9LFxuICAgIF0pO1xuICAgIGV4cGVjdChhc2cucmVuZGVyVGFncygpKS50b0VxdWFsKFtcbiAgICAgIHsga2V5OiAnYXNnJywgdmFsdWU6ICdvbmx5JywgcHJvcGFnYXRlQXRMYXVuY2g6IGZhbHNlIH0sXG4gICAgICB7IGtleTogJ2ZvbycsIHZhbHVlOiAnYmFyJywgcHJvcGFnYXRlQXRMYXVuY2g6IHRydWUgfSxcbiAgICBdKTtcbiAgICBleHBlY3Qoa2V5VmFsdWUucmVuZGVyVGFncygpKS50b0VxdWFsKFtcbiAgICAgIHsgS2V5OiAnYXNnJywgVmFsdWU6ICdvbmx5JyB9LFxuICAgICAgeyBLZXk6ICdmb28nLCBWYWx1ZTogJ2JhcicgfSxcbiAgICBdKTtcbiAgICBleHBlY3QobWFwcGVyLnJlbmRlclRhZ3MoKSkudG9FcXVhbCh7XG4gICAgICBmb286ICdiYXInLFxuICAgICAgYXNnOiAnb25seScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3doZW4gdGhlcmUgYXJlIHRhZ3MgaXQgaGFzVGFncyByZXR1cm5zIHRydWUnLCAoKSA9PiB7XG4gICAgY29uc3QgbWdyID0gbmV3IFRhZ01hbmFnZXIoVGFnVHlwZS5TVEFOREFSRCwgJ0FXUzo6UmVzb3VyY2U6OlR5cGUnKTtcbiAgICBtZ3Iuc2V0VGFnKCdrZXknLCAnbXlWYWwnLCAyKTtcbiAgICBtZ3Iuc2V0VGFnKCdrZXknLCAnbmV3VmFsJywgMSk7XG4gICAgZXhwZWN0KG1nci5oYXNUYWdzKCkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3RhZ3Mgd2l0aCBoaWdoZXIgb3IgZXF1YWwgcHJpb3JpdHkgYWx3YXlzIHRha2UgcHJlY2VkZW5jZScsICgpID0+IHtcbiAgICBjb25zdCBtZ3IgPSBuZXcgVGFnTWFuYWdlcihUYWdUeXBlLlNUQU5EQVJELCAnQVdTOjpSZXNvdXJjZTo6VHlwZScpO1xuICAgIG1nci5zZXRUYWcoJ2tleScsICdteVZhbCcsIDIpO1xuICAgIG1nci5zZXRUYWcoJ2tleScsICduZXdWYWwnLCAxKTtcbiAgICBleHBlY3QobWdyLnJlbmRlclRhZ3MoKSkudG9FcXVhbChbXG4gICAgICB7IGtleTogJ2tleScsIHZhbHVlOiAnbXlWYWwnIH0sXG4gICAgXSk7XG4gICAgbWdyLnJlbW92ZVRhZygna2V5JywgMSk7XG4gICAgZXhwZWN0KG1nci5yZW5kZXJUYWdzKCkpLnRvRXF1YWwoW1xuICAgICAgeyBrZXk6ICdrZXknLCB2YWx1ZTogJ215VmFsJyB9LFxuICAgIF0pO1xuICAgIG1nci5yZW1vdmVUYWcoJ2tleScsIDIpO1xuICAgIGV4cGVjdChtZ3IucmVuZGVyVGFncygpKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3RhZ3MgYXJlIGFsd2F5cyBvcmRlcmVkIGJ5IGtleSBuYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IG1nciA9IG5ldyBUYWdNYW5hZ2VyKFRhZ1R5cGUuU1RBTkRBUkQsICdBV1M6OlJlc291cmNlOjpUeXBlJyk7XG4gICAgbWdyLnNldFRhZygna2V5JywgJ2ZvbycpO1xuICAgIG1nci5zZXRUYWcoJ2FhcmR2YXJrJywgJ3plYnJhJyk7XG4gICAgbWdyLnNldFRhZygnbmFtZScsICd0ZXN0Jyk7XG4gICAgZXhwZWN0KG1nci5yZW5kZXJUYWdzKCkpLnRvRXF1YWwoW1xuICAgICAgeyBrZXk6ICdhYXJkdmFyaycsIHZhbHVlOiAnemVicmEnIH0sXG4gICAgICB7IGtleTogJ2tleScsIHZhbHVlOiAnZm9vJyB9LFxuICAgICAgeyBrZXk6ICduYW1lJywgdmFsdWU6ICd0ZXN0JyB9LFxuICAgIF0pO1xuICAgIG1nci5zZXRUYWcoJ215S2V5JywgJ215VmFsJyk7XG4gICAgZXhwZWN0KG1nci5yZW5kZXJUYWdzKCkpLnRvRXF1YWwoW1xuICAgICAgeyBrZXk6ICdhYXJkdmFyaycsIHZhbHVlOiAnemVicmEnIH0sXG4gICAgICB7IGtleTogJ2tleScsIHZhbHVlOiAnZm9vJyB9LFxuICAgICAgeyBrZXk6ICdteUtleScsIHZhbHVlOiAnbXlWYWwnIH0sXG4gICAgICB7IGtleTogJ25hbWUnLCB2YWx1ZTogJ3Rlc3QnIH0sXG4gICAgXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2V4Y2x1ZGVSZXNvdXJjZVR5cGVzIG9ubHkgdGFncyByZXNvdXJjZXMgdGhhdCBkbyBub3QgbWF0Y2gnLCAoKSA9PiB7XG4gICAgY29uc3QgbWdyID0gbmV3IFRhZ01hbmFnZXIoVGFnVHlwZS5TVEFOREFSRCwgJ0FXUzo6RmFrZTo6UmVzb3VyY2UnKTtcblxuICAgIGV4cGVjdChmYWxzZSkudG9FcXVhbChtZ3IuYXBwbHlUYWdBc3BlY3RIZXJlKFtdLCBbJ0FXUzo6RmFrZTo6UmVzb3VyY2UnXSkpO1xuICAgIGV4cGVjdCh0cnVlKS50b0VxdWFsKG1nci5hcHBseVRhZ0FzcGVjdEhlcmUoW10sIFsnQVdTOjpXcm9uZzo6UmVzb3VyY2UnXSkpO1xuICB9KTtcblxuICB0ZXN0KCdpbmNsdWRlUmVzb3VyY2VUeXBlcyBvbmx5IHRhZ3MgcmVzb3VyY2VzIHRoYXQgbWF0Y2gnLCAoKSA9PiB7XG4gICAgY29uc3QgbWdyID0gbmV3IFRhZ01hbmFnZXIoVGFnVHlwZS5TVEFOREFSRCwgJ0FXUzo6RmFrZTo6UmVzb3VyY2UnKTtcblxuICAgIGV4cGVjdCh0cnVlKS50b0VxdWFsKG1nci5hcHBseVRhZ0FzcGVjdEhlcmUoWydBV1M6OkZha2U6OlJlc291cmNlJ10sIFtdKSk7XG4gICAgZXhwZWN0KGZhbHNlKS50b0VxdWFsKG1nci5hcHBseVRhZ0FzcGVjdEhlcmUoWydBV1M6Oldyb25nOjpSZXNvdXJjZSddLCBbXSkpO1xuICB9KTtcbn0pO1xuIl19