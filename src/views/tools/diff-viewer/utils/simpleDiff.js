/**
 * Simple line-based diff implementation using LCS
 * Returns unified diff string
 */

export function createUnifiedDiff(original, modified) {
    const originalLines = original.split(/\r?\n/);
    const modifiedLines = modified.split(/\r?\n/);

    // Compute LCS matrix
    const matrix = Array(originalLines.length + 1).fill(null).map(() => Array(modifiedLines.length + 1).fill(0));

    for (let i = 1; i <= originalLines.length; i++) {
        for (let j = 1; j <= modifiedLines.length; j++) {
            if (originalLines[i - 1] === modifiedLines[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1] + 1;
            } else {
                matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
            }
        }
    }

    // Backtrack to generate diff
    let i = originalLines.length;
    let j = modifiedLines.length;
    const diff = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && originalLines[i - 1] === modifiedLines[j - 1]) {
            diff.unshift('  ' + originalLines[i - 1]);
            i--;
            j--;
        } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
            diff.unshift('+ ' + modifiedLines[j - 1]);
            j--;
        } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
            diff.unshift('- ' + originalLines[i - 1]);
            i--;
        }
    }

    // Add header
    const header = [
        '--- Original',
        '+++ Modified',
        '@@ -1,' + originalLines.length + ' +1,' + modifiedLines.length + ' @@'
    ];

    return header.concat(diff).join('\n');
}
