"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ *
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const ec2 = require("../lib");
const app = new cdk.App();
class ConstructThatTakesAVpc extends constructs_1.Construct {
    constructor(scope, id, _props) {
        super(scope, id);
    }
}
/// !show
/**
 * Stack1 creates the VPC
 */
class Stack1 extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.vpc = new ec2.Vpc(this, 'VPC');
    }
}
/**
 * Stack2 consumes the VPC
 */
class Stack2 extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Pass the VPC to a construct that needs it
        new ConstructThatTakesAVpc(this, 'Construct', {
            vpc: props.vpc,
        });
    }
}
const stack1 = new Stack1(app, 'Stack1');
const stack2 = new Stack2(app, 'Stack2', {
    vpc: stack1.vpc,
});
/// !hide
Array.isArray(stack2);
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc2hhcmUtdnBjcy5saXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zaGFyZS12cGNzLmxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdCQUFnQjtBQUNoQixxQ0FBcUM7QUFDckMsMkNBQXVDO0FBQ3ZDLDhCQUE4QjtBQUU5QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQU0xQixNQUFNLHNCQUF1QixTQUFRLHNCQUFTO0lBQzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsTUFBbUM7UUFDM0UsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQU1sQjtDQUNGO0FBRUQsU0FBUztBQUNUOztHQUVHO0FBQ0gsTUFBTSxNQUFPLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFHNUIsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNyQztDQUNGO0FBTUQ7O0dBRUc7QUFDSCxNQUFNLE1BQU8sU0FBUSxHQUFHLENBQUMsS0FBSztJQUM1QixZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDeEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNENBQTRDO1FBQzVDLElBQUksc0JBQXNCLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUM1QyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7U0FDZixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3pDLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7SUFDdkMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHO0NBQ2hCLENBQUMsQ0FBQztBQUNILFNBQVM7QUFFVCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRXRCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnICpcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmludGVyZmFjZSBDb25zdHJ1Y3RUaGF0VGFrZXNBVnBjUHJvcHMge1xuICB2cGM6IGVjMi5JVnBjO1xufVxuXG5jbGFzcyBDb25zdHJ1Y3RUaGF0VGFrZXNBVnBjIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgX3Byb3BzOiBDb25zdHJ1Y3RUaGF0VGFrZXNBVnBjUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gbmV3IGVjMi5DZm5JbnN0YW5jZSh0aGlzLCAnSW5zdGFuY2UnLCB7XG4gICAgLy8gICBzdWJuZXRJZDogcHJvcHMudnBjLnByaXZhdGVTdWJuZXRzWzBdLnN1Ym5ldElkLFxuICAgIC8vICAgaW1hZ2VJZDogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCkuZ2V0SW1hZ2UodGhpcykuaW1hZ2VJZCxcbiAgICAvLyB9KTtcbiAgfVxufVxuXG4vLy8gIXNob3dcbi8qKlxuICogU3RhY2sxIGNyZWF0ZXMgdGhlIFZQQ1xuICovXG5jbGFzcyBTdGFjazEgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBwdWJsaWMgcmVhZG9ubHkgdnBjOiBlYzIuVnBjO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICB0aGlzLnZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWUEMnKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgU3RhY2syUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHZwYzogZWMyLklWcGM7XG59XG5cbi8qKlxuICogU3RhY2syIGNvbnN1bWVzIHRoZSBWUENcbiAqL1xuY2xhc3MgU3RhY2syIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzOiBTdGFjazJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gUGFzcyB0aGUgVlBDIHRvIGEgY29uc3RydWN0IHRoYXQgbmVlZHMgaXRcbiAgICBuZXcgQ29uc3RydWN0VGhhdFRha2VzQVZwYyh0aGlzLCAnQ29uc3RydWN0Jywge1xuICAgICAgdnBjOiBwcm9wcy52cGMsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrMShhcHAsICdTdGFjazEnKTtcbmNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjazIoYXBwLCAnU3RhY2syJywge1xuICB2cGM6IHN0YWNrMS52cGMsXG59KTtcbi8vLyAhaGlkZVxuXG5BcnJheS5pc0FycmF5KHN0YWNrMik7XG5cbmFwcC5zeW50aCgpO1xuIl19