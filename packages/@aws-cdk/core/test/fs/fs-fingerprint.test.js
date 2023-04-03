"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const os = require("os");
const path = require("path");
const fs_1 = require("../../lib/fs");
const fingerprint_1 = require("../../lib/fs/fingerprint");
describe('fs fingerprint', () => {
    describe('files', () => {
        test('does not change with the file name', () => {
            // GIVEN
            const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'hash-tests'));
            const content = 'Hello, world!';
            const input1 = path.join(workdir, 'input1.txt');
            const input2 = path.join(workdir, 'input2.txt');
            const input3 = path.join(workdir, 'input3.txt');
            fs.writeFileSync(input1, content);
            fs.writeFileSync(input2, content);
            fs.writeFileSync(input3, content + '.'); // add one character, hash should be different
            // WHEN
            const hash1 = fs_1.FileSystem.fingerprint(input1);
            const hash2 = fs_1.FileSystem.fingerprint(input2);
            const hash3 = fs_1.FileSystem.fingerprint(input3);
            // THEN
            expect(hash1).toEqual(hash2);
            expect(hash3).not.toEqual(hash1);
        });
        test('works on empty files', () => {
            // GIVEN
            const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'hash-tests'));
            const input1 = path.join(workdir, 'empty');
            const input2 = path.join(workdir, 'empty');
            fs.writeFileSync(input1, '');
            fs.writeFileSync(input2, '');
            // WHEN
            const hash1 = fs_1.FileSystem.fingerprint(input1);
            const hash2 = fs_1.FileSystem.fingerprint(input2);
            // THEN
            expect(hash1).toEqual(hash2);
        });
    });
    describe('directories', () => {
        test('works on directories', () => {
            // GIVEN
            const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
            const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
            fs_1.FileSystem.copyDirectory(srcdir, outdir);
            // WHEN
            const hashSrc = fs_1.FileSystem.fingerprint(srcdir);
            const hashCopy = fs_1.FileSystem.fingerprint(outdir);
            // THEN
            expect(hashSrc).toEqual(hashCopy);
        });
        test('ignores requested files', () => {
            // GIVEN
            const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
            const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
            fs_1.FileSystem.copyDirectory(srcdir, outdir);
            // WHEN
            const hashSrc = fs_1.FileSystem.fingerprint(srcdir, { exclude: ['*.ignoreme'] });
            fs.writeFileSync(path.join(outdir, `${hashSrc}.ignoreme`), 'Ignore me!');
            const hashCopy = fs_1.FileSystem.fingerprint(outdir, { exclude: ['*.ignoreme'] });
            // THEN
            expect(hashSrc).toEqual(hashCopy);
        });
        test('changes with file names', () => {
            // GIVEN
            const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
            const cpydir = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
            fs_1.FileSystem.copyDirectory(srcdir, cpydir);
            // be careful not to break a symlink
            fs.renameSync(path.join(cpydir, 'normal-dir', 'file-in-subdir.txt'), path.join(cpydir, 'move-me.txt'));
            // WHEN
            const hashSrc = fs_1.FileSystem.fingerprint(srcdir);
            const hashCopy = fs_1.FileSystem.fingerprint(cpydir);
            // THEN
            expect(hashSrc).not.toEqual(hashCopy);
        });
    });
    describe('symlinks', () => {
        test('changes with the contents of followed symlink referent', () => {
            // GIVEN
            const dir1 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
            const dir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
            const target = path.join(dir1, 'boom.txt');
            const content = 'boom';
            fs.writeFileSync(target, content);
            fs.symlinkSync(target, path.join(dir2, 'link-to-boom.txt'));
            // now dir2 contains a symlink to a file in dir1
            // WHEN
            const original = fs_1.FileSystem.fingerprint(dir2);
            // now change the contents of the target
            fs.writeFileSync(target, 'changning you!');
            const afterChange = fs_1.FileSystem.fingerprint(dir2);
            // revert the content to original and expect hash to be reverted
            fs.writeFileSync(target, content);
            const afterRevert = fs_1.FileSystem.fingerprint(dir2);
            // THEN
            expect(original).not.toEqual(afterChange);
            expect(afterRevert).toEqual(original);
        });
        test('does not change with the contents of un-followed symlink referent', () => {
            // GIVEN
            const dir1 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
            const dir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
            const target = path.join(dir1, 'boom.txt');
            const content = 'boom';
            fs.writeFileSync(target, content);
            fs.symlinkSync(target, path.join(dir2, 'link-to-boom.txt'));
            // now dir2 contains a symlink to a file in dir1
            // WHEN
            const original = fs_1.FileSystem.fingerprint(dir2, { follow: fs_1.SymlinkFollowMode.NEVER });
            // now change the contents of the target
            fs.writeFileSync(target, 'changning you!');
            const afterChange = fs_1.FileSystem.fingerprint(dir2, { follow: fs_1.SymlinkFollowMode.NEVER });
            // revert the content to original and expect hash to be reverted
            fs.writeFileSync(target, content);
            const afterRevert = fs_1.FileSystem.fingerprint(dir2, { follow: fs_1.SymlinkFollowMode.NEVER });
            // THEN
            expect(original).toEqual(afterChange);
            expect(afterRevert).toEqual(original);
        });
    });
    describe('eol', () => {
        test('normalizes line endings', () => {
            // GIVEN
            const lf = path.join(__dirname, 'eol', 'lf.txt');
            const crlf = path.join(__dirname, 'eol', 'crlf.txt');
            fs.writeFileSync(crlf, fs.readFileSync(lf, 'utf8').replace(/\n/g, '\r\n'));
            const lfStat = fs.statSync(lf);
            const crlfStat = fs.statSync(crlf);
            // WHEN
            const crlfHash = fingerprint_1.contentFingerprint(crlf);
            const lfHash = fingerprint_1.contentFingerprint(lf);
            // THEN
            expect(crlfStat.size).not.toEqual(lfStat.size); // Difference in size due to different line endings
            expect(crlfHash).toEqual(lfHash); // Same hash
            fs.unlinkSync(crlf);
        });
    });
    // The fingerprint cache is only enabled for node v12 and higher as older
    // versions can have false positive inode comparisons due to floating point
    // rounding error.
    const describe_nodev12 = Number(process.versions.node.split('.')[0]) < 12 ? describe.skip : describe;
    describe_nodev12('fingerprint cache', () => {
        const testString = 'hello world';
        const testFile = path.join(__dirname, 'inode-fp.1');
        // This always-false ternary is just to help typescript infer the type properly
        let openSyncSpy = false ? jest.spyOn(fs, 'openSync') : undefined;
        // Create a very large test file
        beforeAll(() => {
            const file = fs.openSync(testFile, 'w');
            fs.writeSync(file, testString);
            fs.closeSync(file);
            openSyncSpy = jest.spyOn(fs, 'openSync');
        });
        afterAll(() => {
            fs.unlinkSync(testFile);
            openSyncSpy?.mockRestore();
        });
        test('caches fingerprint results', () => {
            const hash1 = fs_1.FileSystem.fingerprint(testFile, {});
            const hash2 = fs_1.FileSystem.fingerprint(testFile, {});
            expect(hash1).toEqual(hash2);
            expect(openSyncSpy).toHaveBeenCalledTimes(1);
        });
        test('considers mtime', () => {
            const hash1 = fs_1.FileSystem.fingerprint(testFile, {});
            const file = fs.openSync(testFile, 'r+');
            fs.writeSync(file, 'foobar');
            fs.closeSync(file);
            // Update mtime to a value that is guaranteed to be different even if the tests run... fast!
            const fileStat = fs.statSync(testFile, { bigint: true });
            fs.utimesSync(testFile, fileStat.atime, new Date(1337));
            const hash2 = fs_1.FileSystem.fingerprint(testFile, {});
            expect(hash1).not.toEqual(hash2);
            expect(openSyncSpy).toHaveBeenCalledTimes(3);
        });
    });
    test('normalizes relative path', () => {
        // Simulate a Windows path.relative()
        const originalPathRelative = path.relative;
        const pathRelativeSpy = jest.spyOn(path, 'relative').mockImplementation((from, to) => {
            return originalPathRelative(from, to).replace(/\//g, '\\');
        });
        const hash1 = fs_1.FileSystem.fingerprint(path.join(__dirname, 'fixtures', 'test1'));
        // Restore Linux behavior
        pathRelativeSpy.mockRestore();
        const hash2 = fs_1.FileSystem.fingerprint(path.join(__dirname, 'fixtures', 'test1'));
        // Relative paths are normalized
        expect(hash1).toEqual(hash2);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMtZmluZ2VycHJpbnQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZzLWZpbmdlcnByaW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBeUI7QUFDekIseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxQ0FBNkQ7QUFDN0QsMERBQThEO0FBRTlELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDckIsSUFBSSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtZQUM5QyxRQUFRO1lBQ1IsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQztZQUNoQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNoRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNoRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNoRCxFQUFFLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNsQyxFQUFFLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNsQyxFQUFFLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyw4Q0FBOEM7WUFFdkYsT0FBTztZQUNQLE1BQU0sS0FBSyxHQUFHLGVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0MsTUFBTSxLQUFL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QUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIG9zIGZyb20gJ29zJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBGaWxlU3lzdGVtLCBTeW1saW5rRm9sbG93TW9kZSB9IGZyb20gJy4uLy4uL2xpYi9mcyc7XG5pbXBvcnQgeyBjb250ZW50RmluZ2VycHJpbnQgfSBmcm9tICcuLi8uLi9saWIvZnMvZmluZ2VycHJpbnQnO1xuXG5kZXNjcmliZSgnZnMgZmluZ2VycHJpbnQnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdmaWxlcycsICgpID0+IHtcbiAgICB0ZXN0KCdkb2VzIG5vdCBjaGFuZ2Ugd2l0aCB0aGUgZmlsZSBuYW1lJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHdvcmtkaXIgPSBmcy5ta2R0ZW1wU3luYyhwYXRoLmpvaW4ob3MudG1wZGlyKCksICdoYXNoLXRlc3RzJykpO1xuICAgICAgY29uc3QgY29udGVudCA9ICdIZWxsbywgd29ybGQhJztcbiAgICAgIGNvbnN0IGlucHV0MSA9IHBhdGguam9pbih3b3JrZGlyLCAnaW5wdXQxLnR4dCcpO1xuICAgICAgY29uc3QgaW5wdXQyID0gcGF0aC5qb2luKHdvcmtkaXIsICdpbnB1dDIudHh0Jyk7XG4gICAgICBjb25zdCBpbnB1dDMgPSBwYXRoLmpvaW4od29ya2RpciwgJ2lucHV0My50eHQnKTtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoaW5wdXQxLCBjb250ZW50KTtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoaW5wdXQyLCBjb250ZW50KTtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoaW5wdXQzLCBjb250ZW50ICsgJy4nKTsgLy8gYWRkIG9uZSBjaGFyYWN0ZXIsIGhhc2ggc2hvdWxkIGJlIGRpZmZlcmVudFxuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBoYXNoMSA9IEZpbGVTeXN0ZW0uZmluZ2VycHJpbnQoaW5wdXQxKTtcbiAgICAgIGNvbnN0IGhhc2gyID0gRmlsZVN5c3RlbS5maW5nZXJwcmludChpbnB1dDIpO1xuICAgICAgY29uc3QgaGFzaDMgPSBGaWxlU3lzdGVtLmZpbmdlcnByaW50KGlucHV0Myk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChoYXNoMSkudG9FcXVhbChoYXNoMik7XG4gICAgICBleHBlY3QoaGFzaDMpLm5vdC50b0VxdWFsKGhhc2gxKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd29ya3Mgb24gZW1wdHkgZmlsZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgd29ya2RpciA9IGZzLm1rZHRlbXBTeW5jKHBhdGguam9pbihvcy50bXBkaXIoKSwgJ2hhc2gtdGVzdHMnKSk7XG4gICAgICBjb25zdCBpbnB1dDEgPSBwYXRoLmpvaW4od29ya2RpciwgJ2VtcHR5Jyk7XG4gICAgICBjb25zdCBpbnB1dDIgPSBwYXRoLmpvaW4od29ya2RpciwgJ2VtcHR5Jyk7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGlucHV0MSwgJycpO1xuICAgICAgZnMud3JpdGVGaWxlU3luYyhpbnB1dDIsICcnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgaGFzaDEgPSBGaWxlU3lzdGVtLmZpbmdlcnByaW50KGlucHV0MSk7XG4gICAgICBjb25zdCBoYXNoMiA9IEZpbGVTeXN0ZW0uZmluZ2VycHJpbnQoaW5wdXQyKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGhhc2gxKS50b0VxdWFsKGhhc2gyKTtcblxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZGlyZWN0b3JpZXMnLCAoKSA9PiB7XG4gICAgdGVzdCgnd29ya3Mgb24gZGlyZWN0b3JpZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3JjZGlyID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ3N5bWxpbmtzJyk7XG4gICAgICBjb25zdCBvdXRkaXIgPSBmcy5ta2R0ZW1wU3luYyhwYXRoLmpvaW4ob3MudG1wZGlyKCksICdjb3B5LXRlc3RzJykpO1xuICAgICAgRmlsZVN5c3RlbS5jb3B5RGlyZWN0b3J5KHNyY2Rpciwgb3V0ZGlyKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgaGFzaFNyYyA9IEZpbGVTeXN0ZW0uZmluZ2VycHJpbnQoc3JjZGlyKTtcbiAgICAgIGNvbnN0IGhhc2hDb3B5ID0gRmlsZVN5c3RlbS5maW5nZXJwcmludChvdXRkaXIpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoaGFzaFNyYykudG9FcXVhbChoYXNoQ29weSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2lnbm9yZXMgcmVxdWVzdGVkIGZpbGVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHNyY2RpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdzeW1saW5rcycpO1xuICAgICAgY29uc3Qgb3V0ZGlyID0gZnMubWtkdGVtcFN5bmMocGF0aC5qb2luKG9zLnRtcGRpcigpLCAnY29weS10ZXN0cycpKTtcbiAgICAgIEZpbGVTeXN0ZW0uY29weURpcmVjdG9yeShzcmNkaXIsIG91dGRpcik7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGhhc2hTcmMgPSBGaWxlU3lzdGVtLmZpbmdlcnByaW50KHNyY2RpciwgeyBleGNsdWRlOiBbJyouaWdub3JlbWUnXSB9KTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0ZGlyLCBgJHtoYXNoU3JjfS5pZ25vcmVtZWApLCAnSWdub3JlIG1lIScpO1xuICAgICAgY29uc3QgaGFzaENvcHkgPSBGaWxlU3lzdGVtLmZpbmdlcnByaW50KG91dGRpciwgeyBleGNsdWRlOiBbJyouaWdub3JlbWUnXSB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGhhc2hTcmMpLnRvRXF1YWwoaGFzaENvcHkpO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjaGFuZ2VzIHdpdGggZmlsZSBuYW1lcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzcmNkaXIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnc3ltbGlua3MnKTtcbiAgICAgIGNvbnN0IGNweWRpciA9IGZzLm1rZHRlbXBTeW5jKHBhdGguam9pbihvcy50bXBkaXIoKSwgJ2ZpbmdlcnByaW50LXRlc3RzJykpO1xuICAgICAgRmlsZVN5c3RlbS5jb3B5RGlyZWN0b3J5KHNyY2RpciwgY3B5ZGlyKTtcblxuICAgICAgLy8gYmUgY2FyZWZ1bCBub3QgdG8gYnJlYWsgYSBzeW1saW5rXG4gICAgICBmcy5yZW5hbWVTeW5jKHBhdGguam9pbihjcHlkaXIsICdub3JtYWwtZGlyJywgJ2ZpbGUtaW4tc3ViZGlyLnR4dCcpLCBwYXRoLmpvaW4oY3B5ZGlyLCAnbW92ZS1tZS50eHQnKSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGhhc2hTcmMgPSBGaWxlU3lzdGVtLmZpbmdlcnByaW50KHNyY2Rpcik7XG4gICAgICBjb25zdCBoYXNoQ29weSA9IEZpbGVTeXN0ZW0uZmluZ2VycHJpbnQoY3B5ZGlyKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGhhc2hTcmMpLm5vdC50b0VxdWFsKGhhc2hDb3B5KTtcblxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc3ltbGlua3MnLCAoKSA9PiB7XG4gICAgdGVzdCgnY2hhbmdlcyB3aXRoIHRoZSBjb250ZW50cyBvZiBmb2xsb3dlZCBzeW1saW5rIHJlZmVyZW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGRpcjEgPSBmcy5ta2R0ZW1wU3luYyhwYXRoLmpvaW4ob3MudG1wZGlyKCksICdmaW5nZXJwcmludC10ZXN0cycpKTtcbiAgICAgIGNvbnN0IGRpcjIgPSBmcy5ta2R0ZW1wU3luYyhwYXRoLmpvaW4ob3MudG1wZGlyKCksICdmaW5nZXJwcmludC10ZXN0cycpKTtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHBhdGguam9pbihkaXIxLCAnYm9vbS50eHQnKTtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSAnYm9vbSc7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHRhcmdldCwgY29udGVudCk7XG4gICAgICBmcy5zeW1saW5rU3luYyh0YXJnZXQsIHBhdGguam9pbihkaXIyLCAnbGluay10by1ib29tLnR4dCcpKTtcblxuICAgICAgLy8gbm93IGRpcjIgY29udGFpbnMgYSBzeW1saW5rIHRvIGEgZmlsZSBpbiBkaXIxXG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IG9yaWdpbmFsID0gRmlsZVN5c3RlbS5maW5nZXJwcmludChkaXIyKTtcblxuICAgICAgLy8gbm93IGNoYW5nZSB0aGUgY29udGVudHMgb2YgdGhlIHRhcmdldFxuICAgICAgZnMud3JpdGVGaWxlU3luYyh0YXJnZXQsICdjaGFuZ25pbmcgeW91IScpO1xuICAgICAgY29uc3QgYWZ0ZXJDaGFuZ2UgPSBGaWxlU3lzdGVtLmZpbmdlcnByaW50KGRpcjIpO1xuXG4gICAgICAvLyByZXZlcnQgdGhlIGNvbnRlbnQgdG8gb3JpZ2luYWwgYW5kIGV4cGVjdCBoYXNoIHRvIGJlIHJldmVydGVkXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHRhcmdldCwgY29udGVudCk7XG4gICAgICBjb25zdCBhZnRlclJldmVydCA9IEZpbGVTeXN0ZW0uZmluZ2VycHJpbnQoZGlyMik7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChvcmlnaW5hbCkubm90LnRvRXF1YWwoYWZ0ZXJDaGFuZ2UpO1xuICAgICAgZXhwZWN0KGFmdGVyUmV2ZXJ0KS50b0VxdWFsKG9yaWdpbmFsKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2RvZXMgbm90IGNoYW5nZSB3aXRoIHRoZSBjb250ZW50cyBvZiB1bi1mb2xsb3dlZCBzeW1saW5rIHJlZmVyZW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGRpcjEgPSBmcy5ta2R0ZW1wU3luYyhwYXRoLmpvaW4ob3MudG1wZGlyKCksICdmaW5nZXJwcmludC10ZXN0cycpKTtcbiAgICAgIGNvbnN0IGRpcjIgPSBmcy5ta2R0ZW1wU3luYyhwYXRoLmpvaW4ob3MudG1wZGlyKCksICdmaW5nZXJwcmludC10ZXN0cycpKTtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHBhdGguam9pbihkaXIxLCAnYm9vbS50eHQnKTtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSAnYm9vbSc7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHRhcmdldCwgY29udGVudCk7XG4gICAgICBmcy5zeW1saW5rU3luYyh0YXJnZXQsIHBhdGguam9pbihkaXIyLCAnbGluay10by1ib29tLnR4dCcpKTtcblxuICAgICAgLy8gbm93IGRpcjIgY29udGFpbnMgYSBzeW1saW5rIHRvIGEgZmlsZSBpbiBkaXIxXG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IG9yaWdpbmFsID0gRmlsZVN5c3RlbS5maW5nZXJwcmludChkaXIyLCB7IGZvbGxvdzogU3ltbGlua0ZvbGxvd01vZGUuTkVWRVIgfSk7XG5cbiAgICAgIC8vIG5vdyBjaGFuZ2UgdGhlIGNvbnRlbnRzIG9mIHRoZSB0YXJnZXRcbiAgICAgIGZzLndyaXRlRmlsZVN5bmModGFyZ2V0LCAnY2hhbmduaW5nIHlvdSEnKTtcbiAgICAgIGNvbnN0IGFmdGVyQ2hhbmdlID0gRmlsZVN5c3RlbS5maW5nZXJwcmludChkaXIyLCB7IGZvbGxvdzogU3ltbGlua0ZvbGxvd01vZGUuTkVWRVIgfSk7XG5cbiAgICAgIC8vIHJldmVydCB0aGUgY29udGVudCB0byBvcmlnaW5hbCBhbmQgZXhwZWN0IGhhc2ggdG8gYmUgcmV2ZXJ0ZWRcbiAgICAgIGZzLndyaXRlRmlsZVN5bmModGFyZ2V0LCBjb250ZW50KTtcbiAgICAgIGNvbnN0IGFmdGVyUmV2ZXJ0ID0gRmlsZVN5c3RlbS5maW5nZXJwcmludChkaXIyLCB7IGZvbGxvdzogU3ltbGlua0ZvbGxvd01vZGUuTkVWRVIgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChvcmlnaW5hbCkudG9FcXVhbChhZnRlckNoYW5nZSk7XG4gICAgICBleHBlY3QoYWZ0ZXJSZXZlcnQpLnRvRXF1YWwob3JpZ2luYWwpO1xuXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdlb2wnLCAoKSA9PiB7XG4gICAgdGVzdCgnbm9ybWFsaXplcyBsaW5lIGVuZGluZ3MnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgbGYgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZW9sJywgJ2xmLnR4dCcpO1xuICAgICAgY29uc3QgY3JsZiA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdlb2wnLCAnY3JsZi50eHQnKTtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoY3JsZiwgZnMucmVhZEZpbGVTeW5jKGxmLCAndXRmOCcpLnJlcGxhY2UoL1xcbi9nLCAnXFxyXFxuJykpO1xuXG4gICAgICBjb25zdCBsZlN0YXQgPSBmcy5zdGF0U3luYyhsZik7XG4gICAgICBjb25zdCBjcmxmU3RhdCA9IGZzLnN0YXRTeW5jKGNybGYpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjcmxmSGFzaCA9IGNvbnRlbnRGaW5nZXJwcmludChjcmxmKTtcbiAgICAgIGNvbnN0IGxmSGFzaCA9IGNvbnRlbnRGaW5nZXJwcmludChsZik7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChjcmxmU3RhdC5zaXplKS5ub3QudG9FcXVhbChsZlN0YXQuc2l6ZSk7IC8vIERpZmZlcmVuY2UgaW4gc2l6ZSBkdWUgdG8gZGlmZmVyZW50IGxpbmUgZW5kaW5nc1xuICAgICAgZXhwZWN0KGNybGZIYXNoKS50b0VxdWFsKGxmSGFzaCk7IC8vIFNhbWUgaGFzaFxuXG4gICAgICBmcy51bmxpbmtTeW5jKGNybGYpO1xuXG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIFRoZSBmaW5nZXJwcmludCBjYWNoZSBpcyBvbmx5IGVuYWJsZWQgZm9yIG5vZGUgdjEyIGFuZCBoaWdoZXIgYXMgb2xkZXJcbiAgLy8gdmVyc2lvbnMgY2FuIGhhdmUgZmFsc2UgcG9zaXRpdmUgaW5vZGUgY29tcGFyaXNvbnMgZHVlIHRvIGZsb2F0aW5nIHBvaW50XG4gIC8vIHJvdW5kaW5nIGVycm9yLlxuICBjb25zdCBkZXNjcmliZV9ub2RldjEyID0gTnVtYmVyKHByb2Nlc3MudmVyc2lvbnMubm9kZS5zcGxpdCgnLicpWzBdKSA8IDEyID8gZGVzY3JpYmUuc2tpcCA6IGRlc2NyaWJlO1xuICBkZXNjcmliZV9ub2RldjEyKCdmaW5nZXJwcmludCBjYWNoZScsICgpID0+IHtcbiAgICBjb25zdCB0ZXN0U3RyaW5nID0gJ2hlbGxvIHdvcmxkJztcbiAgICBjb25zdCB0ZXN0RmlsZSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdpbm9kZS1mcC4xJyk7XG4gICAgLy8gVGhpcyBhbHdheXMtZmFsc2UgdGVybmFyeSBpcyBqdXN0IHRvIGhlbHAgdHlwZXNjcmlwdCBpbmZlciB0aGUgdHlwZSBwcm9wZXJseVxuICAgIGxldCBvcGVuU3luY1NweSA9IGZhbHNlID8gamVzdC5zcHlPbihmcywgJ29wZW5TeW5jJykgOiB1bmRlZmluZWQ7XG5cbiAgICAvLyBDcmVhdGUgYSB2ZXJ5IGxhcmdlIHRlc3QgZmlsZVxuICAgIGJlZm9yZUFsbCgoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gZnMub3BlblN5bmModGVzdEZpbGUsICd3Jyk7XG4gICAgICBmcy53cml0ZVN5bmMoZmlsZSwgdGVzdFN0cmluZyk7XG4gICAgICBmcy5jbG9zZVN5bmMoZmlsZSk7XG4gICAgICBvcGVuU3luY1NweSA9IGplc3Quc3B5T24oZnMsICdvcGVuU3luYycpO1xuICAgIH0pO1xuXG4gICAgYWZ0ZXJBbGwoKCkgPT4ge1xuICAgICAgZnMudW5saW5rU3luYyh0ZXN0RmlsZSk7XG4gICAgICBvcGVuU3luY1NweT8ubW9ja1Jlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhY2hlcyBmaW5nZXJwcmludCByZXN1bHRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgaGFzaDEgPSBGaWxlU3lzdGVtLmZpbmdlcnByaW50KHRlc3RGaWxlLCB7fSk7XG4gICAgICBjb25zdCBoYXNoMiA9IEZpbGVTeXN0ZW0uZmluZ2VycHJpbnQodGVzdEZpbGUsIHt9KTtcblxuICAgICAgZXhwZWN0KGhhc2gxKS50b0VxdWFsKGhhc2gyKTtcbiAgICAgIGV4cGVjdChvcGVuU3luY1NweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29uc2lkZXJzIG10aW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgaGFzaDEgPSBGaWxlU3lzdGVtLmZpbmdlcnByaW50KHRlc3RGaWxlLCB7fSk7XG5cbiAgICAgIGNvbnN0IGZpbGUgPSBmcy5vcGVuU3luYyh0ZXN0RmlsZSwgJ3IrJyk7XG4gICAgICBmcy53cml0ZVN5bmMoZmlsZSwgJ2Zvb2JhcicpO1xuICAgICAgZnMuY2xvc2VTeW5jKGZpbGUpO1xuXG4gICAgICAvLyBVcGRhdGUgbXRpbWUgdG8gYSB2YWx1ZSB0aGF0IGlzIGd1YXJhbnRlZWQgdG8gYmUgZGlmZmVyZW50IGV2ZW4gaWYgdGhlIHRlc3RzIHJ1bi4uLiBmYXN0IVxuICAgICAgY29uc3QgZmlsZVN0YXQgPSBmcy5zdGF0U3luYyh0ZXN0RmlsZSwgeyBiaWdpbnQ6IHRydWUgfSk7XG4gICAgICBmcy51dGltZXNTeW5jKHRlc3RGaWxlLCBmaWxlU3RhdC5hdGltZSwgbmV3IERhdGUoMTMzNykpO1xuXG4gICAgICBjb25zdCBoYXNoMiA9IEZpbGVTeXN0ZW0uZmluZ2VycHJpbnQodGVzdEZpbGUsIHt9KTtcblxuICAgICAgZXhwZWN0KGhhc2gxKS5ub3QudG9FcXVhbChoYXNoMik7XG4gICAgICBleHBlY3Qob3BlblN5bmNTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygzKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnbm9ybWFsaXplcyByZWxhdGl2ZSBwYXRoJywgKCkgPT4ge1xuICAgIC8vIFNpbXVsYXRlIGEgV2luZG93cyBwYXRoLnJlbGF0aXZlKClcbiAgICBjb25zdCBvcmlnaW5hbFBhdGhSZWxhdGl2ZSA9IHBhdGgucmVsYXRpdmU7XG4gICAgY29uc3QgcGF0aFJlbGF0aXZlU3B5ID0gamVzdC5zcHlPbihwYXRoLCAncmVsYXRpdmUnKS5tb2NrSW1wbGVtZW50YXRpb24oKGZyb206IHN0cmluZywgdG86IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICByZXR1cm4gb3JpZ2luYWxQYXRoUmVsYXRpdmUoZnJvbSwgdG8pLnJlcGxhY2UoL1xcLy9nLCAnXFxcXCcpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaGFzaDEgPSBGaWxlU3lzdGVtLmZpbmdlcnByaW50KHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICd0ZXN0MScpKTtcblxuICAgIC8vIFJlc3RvcmUgTGludXggYmVoYXZpb3JcbiAgICBwYXRoUmVsYXRpdmVTcHkubW9ja1Jlc3RvcmUoKTtcblxuICAgIGNvbnN0IGhhc2gyID0gRmlsZVN5c3RlbS5maW5nZXJwcmludChwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAndGVzdDEnKSk7XG5cbiAgICAvLyBSZWxhdGl2ZSBwYXRocyBhcmUgbm9ybWFsaXplZFxuICAgIGV4cGVjdChoYXNoMSkudG9FcXVhbChoYXNoMik7XG4gIH0pO1xufSk7XG4iXX0=