// Basic swap helper
function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

export const algorithms = {
    *bubble(arr) {
        const n = arr.length;
        yield { type: 'line', lines: { js: 2, python: 2 } }; // n = arr.length

        for (let i = 0; i < n - 1; i++) {
            yield { type: 'line', lines: { js: 3, python: 3 } }; // for i
            for (let j = 0; j < n - i - 1; j++) {
                yield { type: 'line', lines: { js: 4, python: 4 } }; // for j

                // Yield comparison
                yield { type: 'compare', indices: [j, j + 1], lines: { js: 6, python: 6 } }; // compare

                if (arr[j] > arr[j + 1]) {
                    swap(arr, j, j + 1);
                    // Yield swap
                    yield { type: 'swap', indices: [j, j + 1], lines: { js: 8, python: 8 } }; // swap
                }
            }
        }
    },

    *selection(arr) {
        const n = arr.length;
        yield { type: 'line', lines: { js: 2, python: 2 } };

        for (let i = 0; i < n; i++) {
            yield { type: 'line', lines: { js: 3, python: 3 } }; // for i

            let minIdx = i;
            yield { type: 'line', lines: { js: 4, python: 4 } }; // minIdx = i

            for (let j = i + 1; j < n; j++) {
                yield { type: 'line', lines: { js: 5, python: 5 } }; // for j
                yield { type: 'compare', indices: [minIdx, j], lines: { js: 7, python: 7 } }; // if check

                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                    yield { type: 'line', lines: { js: 8, python: 8 } }; // minIdx = j
                }
            }
            yield { type: 'line', lines: { js: 11, python: 9 } }; // if minIdx !== i (Python L9)
            if (minIdx !== i) {
                swap(arr, i, minIdx);
                yield { type: 'swap', indices: [i, minIdx], lines: { js: 13, python: 11 } }; // swap
            }
        }
    },

    *insertion(arr) {
        const n = arr.length;
        yield { type: 'line', lines: { js: 2, python: 2 } };

        for (let i = 1; i < n; i++) {
            yield { type: 'line', lines: { js: 3, python: 3 } }; // for i

            let key = arr[i];
            let j = i - 1;
            yield { type: 'line', lines: { js: 4, python: 4 } }; // key
            yield { type: 'line', lines: { js: 5, python: 5 } }; // j

            yield { type: 'compare', indices: [i, j], lines: { js: 7, python: 6 } }; // while check

            while (j >= 0 && arr[j] > key) {
                // In loop
                yield { type: 'compare', indices: [j, i], lines: { js: 7, python: 6 } };
                arr[j + 1] = arr[j];
                yield { type: 'overwrite', indices: [j + 1], value: arr[j], lines: { js: 8, python: 7 } };
                j = j - 1;
                yield { type: 'line', lines: { js: 9, python: 8 } };
            }
            arr[j + 1] = key;
            yield { type: 'overwrite', indices: [j + 1], value: key, lines: { js: 11, python: 9 } };
        }
    },

    *quick(arr, start = 0, end = arr.length - 1) {
        if (start >= end) {
            yield { type: 'line', lines: { js: 2, python: 2 } };
            return;
        }

        let pivotIndex = start;
        let pivotValue = arr[end];
        yield { type: 'line', lines: { js: 4, python: 4 } };
        yield { type: 'line', lines: { js: 5, python: 5 } };

        for (let i = start; i < end; i++) {
            yield { type: 'line', lines: { js: 7, python: 7 } };
            yield { type: 'compare', indices: [i, end], lines: { js: 8, python: 8 } };

            if (arr[i] < pivotValue) {
                swap(arr, i, pivotIndex);
                yield { type: 'swap', indices: [i, pivotIndex], lines: { js: 10, python: 9 } };
                pivotIndex++;
                yield { type: 'line', lines: { js: 11, python: 10 } };
            }
        }
        swap(arr, pivotIndex, end);
        yield { type: 'swap', indices: [pivotIndex, end], lines: { js: 14, python: 12 } };

        yield { type: 'line', lines: { js: 16, python: 14 } };
        yield* this.quick(arr, start, pivotIndex - 1);

        yield { type: 'line', lines: { js: 17, python: 15 } };
        yield* this.quick(arr, pivotIndex + 1, end);
    },

    *merge(arr, start = 0, end = arr.length - 1) {
        if (start >= end) {
            yield { type: 'line', lines: { js: 2, python: 2 } };
            return;
        }

        const mid = Math.floor((start + end) / 2);
        yield { type: 'line', lines: { js: 4, python: 4 } };

        yield { type: 'line', lines: { js: 5, python: 5 } };
        yield* this.merge(arr, start, mid);

        yield { type: 'line', lines: { js: 6, python: 6 } };
        yield* this.merge(arr, mid + 1, end);

        yield { type: 'line', lines: { js: 8, python: 8 } };
        yield* this.mergeSortMerge(arr, start, mid, end);
    },

    *mergeSortMerge(arr, start, mid, end) {
        const leftArr = arr.slice(start, mid + 1);
        const rightArr = arr.slice(mid + 1, end + 1);

        let k = start;
        let i = 0;
        let j = 0;

        while (i < leftArr.length && j < rightArr.length) {
            yield { type: 'compare', indices: [start + i, mid + 1 + j] };

            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                yield { type: 'overwrite', indices: [k], value: leftArr[i] };
                i++;
            } else {
                arr[k] = rightArr[j];
                yield { type: 'overwrite', indices: [k], value: rightArr[j] };
                j++;
            }
            k++;
        }

        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            yield { type: 'overwrite', indices: [k], value: leftArr[i] };
            i++;
            k++;
        }

        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            yield { type: 'overwrite', indices: [k], value: rightArr[j] };
            j++;
            k++;
        }
    }
}

export const sourceCodeJS = {
    bubble: [
        "async function bubbleSort(arr) {",
        "    const n = arr.length;",
        "    for (let i = 0; i < n - 1; i++) {",
        "        for (let j = 0; j < n - i - 1; j++) {",
        "            // Compare",
        "            if (arr[j] > arr[j + 1]) {",
        "                // Swap",
        "                let temp = arr[j];",
        "                arr[j] = arr[j + 1];",
        "                arr[j + 1] = temp;",
        "            }",
        "        }",
        "    }",
        "}"
    ],
    selection: [
        "async function selectionSort(arr) {",
        "    const n = arr.length;",
        "    for (let i = 0; i < n; i++) {",
        "        let minIdx = i;",
        "        for (let j = i + 1; j < n; j++) {",
        "            // Compare",
        "            if (arr[j] < arr[minIdx]) {",
        "                minIdx = j;",
        "            }",
        "        }",
        "        if (minIdx !== i) {",
        "            // Swap",
        "            let temp = arr[i];",
        "            arr[i] = arr[minIdx];",
        "            arr[minIdx] = temp;",
        "        }",
        "    }",
        "}"
    ],
    insertion: [
        "async function insertionSort(arr) {",
        "    const n = arr.length;",
        "    for (let i = 1; i < n; i++) {",
        "        let key = arr[i];",
        "        let j = i - 1;",
        "        ",
        "        // Active Comparison",
        "        while (j >= 0 && arr[j] > key) {",
        "            arr[j + 1] = arr[j];",
        "            j = j - 1;",
        "        }",
        "        arr[j + 1] = key;",
        "    }",
        "}"
    ],
    quick: [
        "async function quickSort(arr, start, end) {",
        "    if (start >= end) return;",
        "",
        "    let pivotIndex = start;",
        "    let pivotValue = arr[end];",
        "    ",
        "    for (let i = start; i < end; i++) {",
        "        if (arr[i] < pivotValue) {",
        "            swap(arr, i, pivotIndex);",
        "            pivotIndex++;",
        "        }",
        "    }",
        "    swap(arr, pivotIndex, end);",
        "    ",
        "    await quickSort(arr, start, pivotIndex - 1);",
        "    await quickSort(arr, pivotIndex + 1, end);",
        "}"
    ],
    merge: [
        "async function mergeSort(arr, start, end) {",
        "    if (start >= end) return;",
        "    ",
        "    const mid = Math.floor((start + end) / 2);",
        "    await mergeSort(arr, start, mid);",
        "    await mergeSort(arr, mid + 1, end);",
        "    ",
        "    merge(arr, start, mid, end);",
        "}"
    ]
}

export const sourceCodePython = {
    bubble: [
        "def bubble_sort(arr):",
        "    n = len(arr)",
        "    for i in range(n - 1):",
        "        for j in range(n - i - 1):",
        "            # Compare",
        "            if arr[j] > arr[j + 1]:",
        "                # Swap",
        "                arr[j], arr[j + 1] = arr[j + 1], arr[j]",
        "",
        "",
        "",
        "",
        "",
        ""
    ],
    selection: [
        "def selection_sort(arr):",
        "    n = len(arr)",
        "    for i in range(n):",
        "        min_idx = i",
        "        for j in range(i + 1, n):",
        "            # Compare",
        "            if arr[j] < arr[min_idx]:",
        "                min_idx = j",
        "        if min_idx != i:",
        "            # Swap",
        "            arr[i], arr[min_idx] = arr[min_idx], arr[i]",
        "",
        "",
        ""
    ],
    insertion: [
        "def insertion_sort(arr):",
        "    n = len(arr)",
        "    for i in range(1, n):",
        "        key = arr[i]",
        "        j = i - 1",
        "        # Compare & Shift",
        "        while j >= 0 and arr[j] > key:",
        "            arr[j + 1] = arr[j]",
        "            j -= 1",
        "        arr[j + 1] = key",
        "",
        "",
        ""
    ],
    quick: [
        "def quick_sort(arr, start, end):",
        "    if start >= end: return",
        "",
        "    pivot_index = start",
        "    pivot_value = arr[end]",
        "",
        "    for i in range(start, end):",
        "        if arr[i] < pivot_value:",
        "            arr[i], arr[pivot_index] = arr[pivot_index], arr[i]",
        "            pivot_index += 1",
        "",
        "    arr[pivot_index], arr[end] = arr[end], arr[pivot_index]",
        "",
        "    quick_sort(arr, start, pivot_index - 1)",
        "    quick_sort(arr, pivot_index + 1, end)",
        ""
    ],
    merge: [
        "def merge_sort(arr, start, end):",
        "    if start >= end: return",
        "",
        "    mid = (start + end) // 2",
        "    merge_sort(arr, start, mid)",
        "    merge_sort(arr, mid + 1, end)",
        "",
        "    merge(arr, start, mid, end)",
        "",
        "",
        ""
    ]
}

export const sourceCode = {
    js: sourceCodeJS,
    python: sourceCodePython
}
