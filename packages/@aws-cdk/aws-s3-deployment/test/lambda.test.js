"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path = require("path");
test('lambda python pytest', () => {
    const result = child_process_1.spawnSync(path.join(__dirname, 'lambda', 'test.sh'), { stdio: 'inherit' });
    expect(result.status).toBe(0);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW1iZGEudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUEwQztBQUMxQyw2QkFBNkI7QUFFN0IsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtJQUNoQyxNQUFNLE1BQU0sR0FBRyx5QkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQzFGLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG50ZXN0KCdsYW1iZGEgcHl0aG9uIHB5dGVzdCcsICgpID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gc3Bhd25TeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsICdsYW1iZGEnLCAndGVzdC5zaCcpLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gIGV4cGVjdChyZXN1bHQuc3RhdHVzKS50b0JlKDApO1xufSk7Il19