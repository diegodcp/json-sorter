const { strict } = require('assert');
const { sortJson } = require('./index');

// Helper function to compare JSON strings (ignoring whitespace differences)
function compareJson(actual, expected) {
    return JSON.stringify(actual) === JSON.stringify(expected);
}

// Test 1: Basic JSON object sorting (ascending order)
function testBasicJsonAscending() {
    const input = { b: 2, a: 1, c: 3 };
    const options = { order: 'asc' };
    const result = JSON.parse(sortJson(input, options));
    const expected = { a: 1, b: 2, c: 3 };
    strict.ok(compareJson(result, expected), 'Basic JSON object not sorted correctly.');
    console.log('Test passed: Basic JSON object sorting (ascending order)');
}

// Test 2: Basic JSON object sorting (descending order)
function testBasicJsonDescending() {
    const input = { b: 2, a: 1, c: 3 };
    const options = { order: 'desc' };
    const result = JSON.parse(sortJson(input, options));
    const expected = { c: 3, b: 2, a: 1 };
    strict.ok(compareJson(result, expected), 'Basic JSON object not sorted in descending order.');
    console.log('Test passed: Basic JSON object sorting (descending order)');
}

// Test 3: Nested JSON object sorting
function testNestedJsonSorting() {
    const input = { b: { d: 4, c: 3 }, a: { f: 6, e: 5 } };
    const options = { order: 'asc' };
    const result = JSON.parse(sortJson(input, options));
    const expected = { a: { e: 5, f: 6 }, b: { c: 3, d: 4 } };
    strict.ok(compareJson(result, expected), 'Nested JSON object not sorted correctly.');
    console.log('Test passed: Nested JSON object sorting');
}

// Test 4: Plain array sorting (enabled)
function testPlainArraySortingEnabled() {
    const input = [3, 1, 2];
    const options = { order: 'asc', plainArrays: true };
    const result = JSON.parse(sortJson(input, options));
    const expected = [1, 2, 3];
    strict.deepStrictEqual(result, expected, 'Plain array not sorted correctly.');
    console.log('Test passed: Plain array sorting (enabled)');
}

// Test 5: Plain array sorting (disabled)
function testPlainArraySortingDisabled() {
    const input = [3, 1, 2];
    const options = { order: 'asc', plainArrays: false };
    const result = JSON.parse(sortJson(input, options));
    const expected = [3, 1, 2];
    strict.deepStrictEqual(result, expected, 'Plain array was sorted despite plainArrays being false.');
    console.log('Test passed: Plain array sorting (disabled)');
}

// Test 6: ARB file support (ascending order)
function testArbFileSupportAscending() {
    console.log('Start testArbFileSupportAscending:')
    const input = {
        "@@locale": "en",
        "@commonCustomDateFormat": {
            placeholders: {
                date: {
                    type: "DateTime",
                    format: "EEE, M/d/y",
                    isCustomDateFormat: "true"
                }
            }
        },
        commonCustomDateFormat: "Custom date format: {date}",
        nestedArray: [{ b: 2 }, { a: 1 }, [3, 2, 1]]
    };
    const options = { order: 'asc', arbSupport: true, plainArrays: true };
    const result = JSON.parse(sortJson(input, options));
    const expected = {
        "@@locale": "en",
        "@commonCustomDateFormat": {
            placeholders: {
                date: {
                    format: "EEE, M/d/y",
                    isCustomDateFormat: "true",
                    type: "DateTime"
                }
            }
        },
        commonCustomDateFormat: "Custom date format: {date}",
        nestedArray: [[1, 2, 3], { a: 1 }, { b: 2 }]
    };
    // console.log(result);
    strict.ok(compareJson(result, expected), 'ARB file not sorted correctly.');
    console.log('Test passed: ARB file support (ascending order)');
}

// Test 7: ARB file support (descending order)
function testArbFileSupportDescending() {
    console.log('Start testArbFileSupportDescending:')
    const input = {
        "@@locale": "en",
        "@commonCustomDateFormat": {
            placeholders: {
                date: {
                    type: "DateTime",
                    format: "EEE, M/d/y",
                    isCustomDateFormat: "true",
                    aa: "bb",
                    zz: "xx"
                }
            }
        },
        commonCustomDateFormat: "Custom date format: {date}"
    };
    const options = { order: 'desc', arbSupport: true, plainArrays: false };
    const result = JSON.parse(sortJson(input, options));
    const expected = {
        "@commonCustomDateFormat": {
            placeholders: {
                date: {
                    zz: "xx",
                    type: "DateTime",
                    isCustomDateFormat: "true",
                    format: "EEE, M/d/y",
                    aa: "bb"
                }
            }
        },
        commonCustomDateFormat: "Custom date format: {date}",
        "@@locale": "en"
    };
    strict.ok(compareJson(result, expected), 'ARB file not sorted in descending order.');
    console.log('Test passed: ARB file support (descending order)');
}

// Test 8: Complex JSON with mixed structures
function testComplexJsonWithMixedStructures() {
    const input = {
        b: { d: 4, c: 3 },
        a: [3, 1, 2],
        c: "string",
        d: { f: { h: 8, g: 7 }, e: 5 }
    };
    const options = { order: 'asc', plainArrays: true };
    const result = JSON.parse(sortJson(input, options));
    const expected = {
        a: [1, 2, 3],
        b: { c: 3, d: 4 },
        c: "string",
        d: { e: 5, f: { g: 7, h: 8 } }
    };
    strict.ok(compareJson(result, expected), 'Complex JSON not handled correctly.');
    console.log('Test passed: Complex JSON with mixed structures');
}

// Test 9: Indentation with spaces
function testIndentationWithSpaces() {
    const input = { b: 2, a: 1 };
    const options = { order: 'asc', indentation: 'spaces' };
    const result = sortJson(input, options);
    const expected = '{\n  "a": 1,\n  "b": 2\n}';
    strict.strictEqual(result, expected, 'JSON not formatted with spaces.');
    console.log('Test passed: Indentation with spaces');
}

// Test 10: Indentation with tabs
function testIndentationWithTabs() {
    const input = { b: 2, a: 1 };
    const options = { order: 'asc', indentation: 'tabs' };
    const result = sortJson(input, options);
    const expected = '{\n\t"a": 1,\n\t"b": 2\n}';
    strict.strictEqual(result, expected, 'JSON not formatted with tabs.');
    console.log('Test passed: Indentation with tabs');
}

// Test 11: Empty JSON object
function testEmptyJsonObject() {
    const input = {};
    const options = { order: 'asc' };
    const result = JSON.parse(sortJson(input, options));
    const expected = {};
    strict.ok(compareJson(result, expected), 'Empty JSON object not handled correctly.');
    console.log('Test passed: Empty JSON object');
}

// Test 12: Empty JSON array
function testEmptyJsonArray() {
    const input = [];
    const options = { order: 'asc', plainArrays: true };
    const result = JSON.parse(sortJson(input, options));
    const expected = [];
    strict.deepStrictEqual(result, expected, 'Empty JSON array not handled correctly.');
    console.log('Test passed: Empty JSON array');
}

// Run all tests
[
    testBasicJsonAscending,
    testBasicJsonDescending,
    testNestedJsonSorting,
    testPlainArraySortingEnabled,
    testPlainArraySortingDisabled,
    testArbFileSupportAscending,
    testArbFileSupportDescending,
    testComplexJsonWithMixedStructures,
    testIndentationWithSpaces,
    testIndentationWithTabs,
    testEmptyJsonObject,
    testEmptyJsonArray
].forEach(test => test());

console.log('All tests passed!');