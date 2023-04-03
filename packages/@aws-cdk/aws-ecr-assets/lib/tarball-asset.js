"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarballImageAsset = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const ecr = require("@aws-cdk/aws-ecr");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
/**
 * An asset that represents a Docker image.
 *
 * The image will loaded from an existing tarball and uploaded to an ECR repository.
 */
class TarballImageAsset extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecr_assets_TarballImageAssetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, TarballImageAsset);
            }
            throw error;
        }
        if (!fs.existsSync(props.tarballFile)) {
            throw new Error(`Cannot find file at ${props.tarballFile}`);
        }
        const stagedTarball = new core_1.AssetStaging(this, 'Staging', { sourcePath: props.tarballFile });
        this.sourceHash = stagedTarball.assetHash;
        this.assetHash = stagedTarball.assetHash;
        const stage = core_1.Stage.of(this);
        const relativePathInOutDir = stage ? path.relative(stage.assetOutdir, stagedTarball.absoluteStagedPath) : stagedTarball.absoluteStagedPath;
        const stack = core_1.Stack.of(this);
        const location = stack.synthesizer.addDockerImageAsset({
            sourceHash: stagedTarball.assetHash,
            executable: [
                'sh',
                '-c',
                `docker load -i ${relativePathInOutDir} | tail -n 1 | sed "s/Loaded image: //g"`,
            ],
        });
        this.repository = ecr.Repository.fromRepositoryName(this, 'Repository', location.repositoryName);
        this.imageUri = location.imageUri;
        this.imageTag = location.imageTag ?? this.assetHash;
    }
}
exports.TarballImageAsset = TarballImageAsset;
_a = JSII_RTTI_SYMBOL_1;
TarballImageAsset[_a] = { fqn: "@aws-cdk/aws-ecr-assets.TarballImageAsset", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyYmFsbC1hc3NldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhcmJhbGwtYXNzZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3Qix3Q0FBd0M7QUFDeEMsd0NBQTJEO0FBQzNELDJDQUF1QztBQWdCdkM7Ozs7R0FJRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsc0JBQVM7SUFnQzlDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBNkI7UUFDckUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQWpDUixpQkFBaUI7Ozs7UUFtQzFCLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUM3RDtRQUVELE1BQU0sYUFBYSxHQUFHLElBQUksbUJBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBRTNGLElBQUksQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQztRQUMxQyxJQUFJLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUM7UUFFekMsTUFBTSxLQUFLLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixNQUFNLG9CQUFvQixHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUM7UUFFM0ksTUFBTSxLQUFLLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDO1lBQ3JELFVBQVUsRUFBRSxhQUFhLENBQUMsU0FBUztZQUNuQyxVQUFVLEVBQUU7Z0JBQ1YsSUFBSTtnQkFDSixJQUFJO2dCQUNKLGtCQUFrQixvQkFBb0IsMENBQTBDO2FBQ2pGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pHLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQztLQUNyRDs7QUE1REgsOENBNkRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IElBc3NldCB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2V0cyc7XG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcic7XG5pbXBvcnQgeyBBc3NldFN0YWdpbmcsIFN0YWNrLCBTdGFnZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgVGFyYmFsbEltYWdlQXNzZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUYXJiYWxsSW1hZ2VBc3NldFByb3BzIHtcbiAgLyoqXG4gICAqIEFic29sdXRlIHBhdGggdG8gdGhlIHRhcmJhbGwuXG4gICAqXG4gICAqIEl0IGlzIHJlY29tbWVuZGVkIHRvIHRvIHVzZSB0aGUgc2NyaXB0IHJ1bm5pbmcgZGlyZWN0b3J5IChlLmcuIGBfX2Rpcm5hbWVgXG4gICAqIGluIE5vZGUuanMgcHJvamVjdHMgb3IgZGlybmFtZSBvZiBgX19maWxlX19gIGluIFB5dGhvbikgaWYgeW91ciB0YXJiYWxsXG4gICAqIGlzIGxvY2F0ZWQgYXMgYSByZXNvdXJjZSBpbnNpZGUgeW91ciBwcm9qZWN0LlxuICAgKi9cbiAgcmVhZG9ubHkgdGFyYmFsbEZpbGU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBbiBhc3NldCB0aGF0IHJlcHJlc2VudHMgYSBEb2NrZXIgaW1hZ2UuXG4gKlxuICogVGhlIGltYWdlIHdpbGwgbG9hZGVkIGZyb20gYW4gZXhpc3RpbmcgdGFyYmFsbCBhbmQgdXBsb2FkZWQgdG8gYW4gRUNSIHJlcG9zaXRvcnkuXG4gKi9cbmV4cG9ydCBjbGFzcyBUYXJiYWxsSW1hZ2VBc3NldCBleHRlbmRzIENvbnN0cnVjdCBpbXBsZW1lbnRzIElBc3NldCB7XG4gIC8qKlxuICAgKiBUaGUgZnVsbCBVUkkgb2YgdGhlIGltYWdlIChpbmNsdWRpbmcgYSB0YWcpLiBVc2UgdGhpcyByZWZlcmVuY2UgdG8gcHVsbFxuICAgKiB0aGUgYXNzZXQuXG4gICAqL1xuICBwdWJsaWMgaW1hZ2VVcmk6IHN0cmluZztcblxuICAvKipcbiAgICogUmVwb3NpdG9yeSB3aGVyZSB0aGUgaW1hZ2UgaXMgc3RvcmVkXG4gICAqL1xuICBwdWJsaWMgcmVwb3NpdG9yeTogZWNyLklSZXBvc2l0b3J5O1xuXG4gIC8qKlxuICAgKiBBIGhhc2ggb2YgdGhlIHNvdXJjZSBvZiB0aGlzIGFzc2V0LCB3aGljaCBpcyBhdmFpbGFibGUgYXQgY29uc3RydWN0aW9uIHRpbWUuIEFzIHRoaXMgaXMgYSBwbGFpblxuICAgKiBzdHJpbmcsIGl0IGNhbiBiZSB1c2VkIGluIGNvbnN0cnVjdCBJRHMgaW4gb3JkZXIgdG8gZW5mb3JjZSBjcmVhdGlvbiBvZiBhIG5ldyByZXNvdXJjZSB3aGVuXG4gICAqIHRoZSBjb250ZW50IGhhc2ggaGFzIGNoYW5nZWQuXG4gICAqIEBkZXByZWNhdGVkIHVzZSBhc3NldEhhc2hcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzb3VyY2VIYXNoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgaGFzaCBvZiB0aGlzIGFzc2V0LCB3aGljaCBpcyBhdmFpbGFibGUgYXQgY29uc3RydWN0aW9uIHRpbWUuIEFzIHRoaXMgaXMgYSBwbGFpbiBzdHJpbmcsIGl0XG4gICAqIGNhbiBiZSB1c2VkIGluIGNvbnN0cnVjdCBJRHMgaW4gb3JkZXIgdG8gZW5mb3JjZSBjcmVhdGlvbiBvZiBhIG5ldyByZXNvdXJjZSB3aGVuIHRoZSBjb250ZW50XG4gICAqIGhhc2ggaGFzIGNoYW5nZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYXNzZXRIYXNoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB0YWcgb2YgdGhpcyBhc3NldCB3aGVuIGl0IGlzIHVwbG9hZGVkIHRvIEVDUi4gVGhlIHRhZyBtYXkgZGlmZmVyIGZyb20gdGhlIGFzc2V0SGFzaCBpZiBhIHN0YWNrIHN5bnRoZXNpemVyIGFkZHMgYSBkb2NrZXJUYWdQcmVmaXguXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW1hZ2VUYWc6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVGFyYmFsbEltYWdlQXNzZXRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMocHJvcHMudGFyYmFsbEZpbGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBmaW5kIGZpbGUgYXQgJHtwcm9wcy50YXJiYWxsRmlsZX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFnZWRUYXJiYWxsID0gbmV3IEFzc2V0U3RhZ2luZyh0aGlzLCAnU3RhZ2luZycsIHsgc291cmNlUGF0aDogcHJvcHMudGFyYmFsbEZpbGUgfSk7XG5cbiAgICB0aGlzLnNvdXJjZUhhc2ggPSBzdGFnZWRUYXJiYWxsLmFzc2V0SGFzaDtcbiAgICB0aGlzLmFzc2V0SGFzaCA9IHN0YWdlZFRhcmJhbGwuYXNzZXRIYXNoO1xuXG4gICAgY29uc3Qgc3RhZ2UgPSBTdGFnZS5vZih0aGlzKTtcbiAgICBjb25zdCByZWxhdGl2ZVBhdGhJbk91dERpciA9IHN0YWdlID8gcGF0aC5yZWxhdGl2ZShzdGFnZS5hc3NldE91dGRpciwgc3RhZ2VkVGFyYmFsbC5hYnNvbHV0ZVN0YWdlZFBhdGgpIDogc3RhZ2VkVGFyYmFsbC5hYnNvbHV0ZVN0YWdlZFBhdGg7XG5cbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuICAgIGNvbnN0IGxvY2F0aW9uID0gc3RhY2suc3ludGhlc2l6ZXIuYWRkRG9ja2VySW1hZ2VBc3NldCh7XG4gICAgICBzb3VyY2VIYXNoOiBzdGFnZWRUYXJiYWxsLmFzc2V0SGFzaCxcbiAgICAgIGV4ZWN1dGFibGU6IFtcbiAgICAgICAgJ3NoJyxcbiAgICAgICAgJy1jJyxcbiAgICAgICAgYGRvY2tlciBsb2FkIC1pICR7cmVsYXRpdmVQYXRoSW5PdXREaXJ9IHwgdGFpbCAtbiAxIHwgc2VkIFwicy9Mb2FkZWQgaW1hZ2U6IC8vZ1wiYCxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlcG9zaXRvcnkgPSBlY3IuUmVwb3NpdG9yeS5mcm9tUmVwb3NpdG9yeU5hbWUodGhpcywgJ1JlcG9zaXRvcnknLCBsb2NhdGlvbi5yZXBvc2l0b3J5TmFtZSk7XG4gICAgdGhpcy5pbWFnZVVyaSA9IGxvY2F0aW9uLmltYWdlVXJpO1xuICAgIHRoaXMuaW1hZ2VUYWcgPSBsb2NhdGlvbi5pbWFnZVRhZyA/PyB0aGlzLmFzc2V0SGFzaDtcbiAgfVxufVxuXG4iXX0=