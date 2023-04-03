"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasNoMessage = exports.hasMessage = exports.findMessage = void 0;
const section_1 = require("./section");
function findMessage(messages, constructPath, props = {}) {
    const section = messages;
    const result = section_1.matchSection(filterPath(section, constructPath), props);
    if (!result.match) {
        return {};
    }
    return result.matches;
}
exports.findMessage = findMessage;
function hasMessage(messages, constructPath, props) {
    const section = messages;
    const result = section_1.matchSection(filterPath(section, constructPath), props);
    if (result.match) {
        return;
    }
    for (const mr of Object.values(result.closestResults)) {
        redactTraces(mr.target);
    }
    return section_1.formatSectionMatchFailure(`messages at path ${constructPath}`, result, 'Stack');
}
exports.hasMessage = hasMessage;
function hasNoMessage(messages, constructPath, props) {
    const section = messages;
    const result = section_1.matchSection(filterPath(section, constructPath), props);
    if (!result.match) {
        return;
    }
    return [
        `Expected no matches, but stack has ${Object.keys(result.matches).length} messages as follows:`,
        section_1.formatAllMatches(result.matches),
    ].join('\n');
}
exports.hasNoMessage = hasNoMessage;
// We redact the stack trace by default because it is unnecessarily long and unintelligible.
// If there is a use case for rendering the trace, we can add it later.
function redactTraces(match, redact = true) {
    if (redact && match.entry?.trace !== undefined) {
        match.entry.trace = 'redacted';
    }
    ;
}
function filterPath(section, path) {
    // default signal for all paths is '*'
    if (path === '*')
        return section;
    return Object.entries(section ?? {})
        .filter(([_, v]) => v.id === path)
        .reduce((agg, [k, v]) => { return { ...agg, [k]: v }; }, {});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSx1Q0FBc0Y7QUFFdEYsU0FBZ0IsV0FBVyxDQUFDLFFBQWtCLEVBQUUsYUFBcUIsRUFBRSxRQUFhLEVBQUU7SUFDcEYsTUFBTSxPQUFPLEdBQXdDLFFBQVEsQ0FBQztJQUM5RCxNQUFNLE1BQU0sR0FBRyxzQkFBWSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7UUFDakIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUN4QixDQUFDO0FBVEQsa0NBU0M7QUFFRCxTQUFnQixVQUFVLENBQUMsUUFBa0IsRUFBRSxhQUFxQixFQUFFLEtBQVU7SUFDOUUsTUFBTSxPQUFPLEdBQXdDLFFBQVEsQ0FBQztJQUM5RCxNQUFNLE1BQU0sR0FBRyxzQkFBWSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdkUsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2hCLE9BQU87S0FDUjtJQUVELEtBQUssTUFBTSxFQUFFLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUU7UUFDckQsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN6QjtJQUVELE9BQU8sbUNBQXlCLENBQUMsb0JBQW9CLGFBQWEsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBWkQsZ0NBWUM7QUFFRCxTQUFnQixZQUFZLENBQUMsUUFBa0IsRUFBRSxhQUFxQixFQUFFLEtBQVU7SUFDaEYsTUFBTSxPQUFPLEdBQXdDLFFBQVEsQ0FBQztJQUM5RCxNQUFNLE1BQU0sR0FBRyxzQkFBWSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7UUFDakIsT0FBTztLQUNSO0lBRUQsT0FBTztRQUNMLHNDQUFzQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLHVCQUF1QjtRQUMvRiwwQkFBZ0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0tBQ2pDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2YsQ0FBQztBQVpELG9DQVlDO0FBRUQsNEZBQTRGO0FBQzVGLHVFQUF1RTtBQUN2RSxTQUFTLFlBQVksQ0FBQyxLQUFVLEVBQUUsU0FBa0IsSUFBSTtJQUN0RCxJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssS0FBSyxTQUFTLEVBQUU7UUFDOUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDO0tBQ2hDO0lBQUEsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxPQUE0QyxFQUFFLElBQVk7SUFDNUUsc0NBQXNDO0lBQ3RDLElBQUksSUFBSSxLQUFLLEdBQUc7UUFBRSxPQUFPLE9BQU8sQ0FBQztJQUVqQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztTQUNqQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUM7U0FDakMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxPQUFPLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNqRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3ludGhlc2lzTWVzc2FnZSB9IGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBNZXNzYWdlcyB9IGZyb20gJy4vbWVzc2FnZSc7XG5pbXBvcnQgeyBmb3JtYXRBbGxNYXRjaGVzLCBtYXRjaFNlY3Rpb24sIGZvcm1hdFNlY3Rpb25NYXRjaEZhaWx1cmUgfSBmcm9tICcuL3NlY3Rpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gZmluZE1lc3NhZ2UobWVzc2FnZXM6IE1lc3NhZ2VzLCBjb25zdHJ1Y3RQYXRoOiBzdHJpbmcsIHByb3BzOiBhbnkgPSB7fSk6IHsgW2tleTogc3RyaW5nXTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB9IHtcbiAgY29uc3Qgc2VjdGlvbjogeyBba2V5OiBzdHJpbmddOiBTeW50aGVzaXNNZXNzYWdlIH0gPSBtZXNzYWdlcztcbiAgY29uc3QgcmVzdWx0ID0gbWF0Y2hTZWN0aW9uKGZpbHRlclBhdGgoc2VjdGlvbiwgY29uc3RydWN0UGF0aCksIHByb3BzKTtcblxuICBpZiAoIXJlc3VsdC5tYXRjaCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQubWF0Y2hlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc01lc3NhZ2UobWVzc2FnZXM6IE1lc3NhZ2VzLCBjb25zdHJ1Y3RQYXRoOiBzdHJpbmcsIHByb3BzOiBhbnkpOiBzdHJpbmcgfCB2b2lkIHtcbiAgY29uc3Qgc2VjdGlvbjogeyBba2V5OiBzdHJpbmddOiBTeW50aGVzaXNNZXNzYWdlIH0gPSBtZXNzYWdlcztcbiAgY29uc3QgcmVzdWx0ID0gbWF0Y2hTZWN0aW9uKGZpbHRlclBhdGgoc2VjdGlvbiwgY29uc3RydWN0UGF0aCksIHByb3BzKTtcbiAgaWYgKHJlc3VsdC5tYXRjaCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoY29uc3QgbXIgb2YgT2JqZWN0LnZhbHVlcyhyZXN1bHQuY2xvc2VzdFJlc3VsdHMpKSB7XG4gICAgcmVkYWN0VHJhY2VzKG1yLnRhcmdldCk7XG4gIH1cblxuICByZXR1cm4gZm9ybWF0U2VjdGlvbk1hdGNoRmFpbHVyZShgbWVzc2FnZXMgYXQgcGF0aCAke2NvbnN0cnVjdFBhdGh9YCwgcmVzdWx0LCAnU3RhY2snKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc05vTWVzc2FnZShtZXNzYWdlczogTWVzc2FnZXMsIGNvbnN0cnVjdFBhdGg6IHN0cmluZywgcHJvcHM6IGFueSk6IHN0cmluZyB8IHZvaWQge1xuICBjb25zdCBzZWN0aW9uOiB7IFtrZXk6IHN0cmluZ106IFN5bnRoZXNpc01lc3NhZ2UgfSA9IG1lc3NhZ2VzO1xuICBjb25zdCByZXN1bHQgPSBtYXRjaFNlY3Rpb24oZmlsdGVyUGF0aChzZWN0aW9uLCBjb25zdHJ1Y3RQYXRoKSwgcHJvcHMpO1xuXG4gIGlmICghcmVzdWx0Lm1hdGNoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIFtcbiAgICBgRXhwZWN0ZWQgbm8gbWF0Y2hlcywgYnV0IHN0YWNrIGhhcyAke09iamVjdC5rZXlzKHJlc3VsdC5tYXRjaGVzKS5sZW5ndGh9IG1lc3NhZ2VzIGFzIGZvbGxvd3M6YCxcbiAgICBmb3JtYXRBbGxNYXRjaGVzKHJlc3VsdC5tYXRjaGVzKSxcbiAgXS5qb2luKCdcXG4nKTtcbn1cblxuLy8gV2UgcmVkYWN0IHRoZSBzdGFjayB0cmFjZSBieSBkZWZhdWx0IGJlY2F1c2UgaXQgaXMgdW5uZWNlc3NhcmlseSBsb25nIGFuZCB1bmludGVsbGlnaWJsZS5cbi8vIElmIHRoZXJlIGlzIGEgdXNlIGNhc2UgZm9yIHJlbmRlcmluZyB0aGUgdHJhY2UsIHdlIGNhbiBhZGQgaXQgbGF0ZXIuXG5mdW5jdGlvbiByZWRhY3RUcmFjZXMobWF0Y2g6IGFueSwgcmVkYWN0OiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICBpZiAocmVkYWN0ICYmIG1hdGNoLmVudHJ5Py50cmFjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbWF0Y2guZW50cnkudHJhY2UgPSAncmVkYWN0ZWQnO1xuICB9O1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJQYXRoKHNlY3Rpb246IHsgW2tleTogc3RyaW5nXTogU3ludGhlc2lzTWVzc2FnZSB9LCBwYXRoOiBzdHJpbmcpOiB7IFtrZXk6IHN0cmluZ106IFN5bnRoZXNpc01lc3NhZ2UgfSB7XG4gIC8vIGRlZmF1bHQgc2lnbmFsIGZvciBhbGwgcGF0aHMgaXMgJyonXG4gIGlmIChwYXRoID09PSAnKicpIHJldHVybiBzZWN0aW9uO1xuXG4gIHJldHVybiBPYmplY3QuZW50cmllcyhzZWN0aW9uID8/IHt9KVxuICAgIC5maWx0ZXIoKFtfLCB2XSkgPT4gdi5pZCA9PT0gcGF0aClcbiAgICAucmVkdWNlKChhZ2csIFtrLCB2XSkgPT4geyByZXR1cm4geyAuLi5hZ2csIFtrXTogdiB9OyB9LCB7fSk7XG59XG4iXX0=