const common = {
    id: 'numpy',
    icon: '🔢'
}

const zh = {
    ...common,
    title: 'NumPy',
    description: 'NumPy 是 Python 科学计算的基础库，提供高性能的多维数组对象和丰富的数学函数。',
    sections: [
        {
            id: 'array-basics',
            title: '数组基础',
            description: 'NumPy 的核心是 ndarray（N-dimensional array）对象，它是一个快速、灵活的大型数据集容器。',
            concepts: [
                {
                    name: 'ndarray 创建',
                    explanation: 'ndarray 是 NumPy 的核心数据结构，可以通过多种方式创建：从 Python 列表、使用内置函数（zeros, ones, arange）等。',
                    math: '\\mathbf{A} \\in \\mathbb{R}^{m \\times n}'
                },
                {
                    name: '数组属性',
                    explanation: '数组具有重要属性：shape（形状）、dtype（数据类型）、ndim（维度数）、size（元素总数）。',
                    math: '\\text{shape} = (n_1, n_2, ..., n_k), \\quad \\text{size} = \\prod_{i=1}^{k} n_i'
                }
            ],
            examples: [
                {
                    title: '创建一维数组',
                    code: `import numpy as np

# 从列表创建数组
# Create array from list
arr = np.array([1, 2, 3, 4, 5])
print("Array:", arr)
print("Shape:", arr.shape)
print("Dtype:", arr.dtype)
print("NDim:", arr.ndim)`,
                    explanation: '使用 np.array() 从 Python 列表创建 NumPy 数组，并查看其基本属性。'
                },
                {
                    title: '创建二维数组',
                    code: `import numpy as np

# 创建 2x3 的二维数组
# Create 2x3 array
arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Array:\\n", arr)
print("Shape:", arr.shape)
print("Size:", arr.size)`,
                    explanation: '二维数组类似于矩阵，shape 返回 (行数, 列数)。'
                },
                {
                    title: '使用内置函数创建数组',
                    code: `import numpy as np

# 创建全零数组 / Zeros
zeros = np.zeros((3, 4))
print("Zeros:\\n", zeros)

# 创建全一数组 / Ones
ones = np.ones((2, 3))
print("\\nOnes:\\n", ones)

# 创建等差数列 / Arange
arange = np.arange(0, 10, 2)
print("\\nArange:", arange)

# 创建等分数列 / Linspace
linspace = np.linspace(0, 1, 5)
print("Linspace:", linspace)`,
                    explanation: 'NumPy 提供了多种便捷函数来创建特定模式的数组。'
                }
            ]
        },
        {
            id: 'array-operations',
            title: '数组操作',
            description: 'NumPy 提供了强大的数组索引、切片和变形功能。',
            concepts: [
                {
                    name: '索引和切片',
                    explanation: '类似 Python 列表，但支持多维索引。使用 [start:stop:step] 语法进行切片。',
                    math: 'A[i, j] \\text{ 访问第 } i \\text{ 行第 } j \\text{ 列元素}'
                },
                {
                    name: '数组变形',
                    explanation: 'reshape() 可以改变数组形状而不改变数据，flatten() 和 ravel() 可以将多维数组展平。',
                    math: '\\mathbf{A}_{m \\times n} \\xrightarrow{\\text{reshape}} \\mathbf{B}_{p \\times q}, \\quad mn = pq'
                }
            ],
            examples: [
                {
                    title: '数组索引',
                    code: `import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("Array:\\n", arr)

# 访问单个元素
print("\\narr[0, 0] =", arr[0, 0])
print("arr[1, 2] =", arr[1, 2])

# 访问整行
print("\\nRow 0:", arr[0, :])

# 访问整列
print("Col 1:", arr[:, 1])`,
                    explanation: '使用 [row, col] 语法访问二维数组元素，冒号 : 表示选择所有。'
                },
                {
                    title: '数组切片',
                    code: `import numpy as np

arr = np.arange(12).reshape(3, 4)
print("Array:\\n", arr)

# 切片前两行
print("\\nFirst 2 rows:\\n", arr[:2, :])

# 切片后两列
print("\\nLast 2 cols:\\n", arr[:, 2:])

# 子矩阵
print("\\nSubmatrix:\\n", arr[1:3, 1:3])`,
                    explanation: '切片操作返回原数组的视图，修改切片会影响原数组。'
                },
                {
                    title: '数组变形',
                    code: `import numpy as np

arr = np.arange(12)
print("Array:", arr)

# 变形为 3x4
reshaped = arr.reshape(3, 4)
print("\\n3x4 Array:\\n", reshaped)

# 变形为 2x6
reshaped2 = arr.reshape(2, 6)
print("\\n2x6 Array:\\n", reshaped2)

# 展平
flattened = reshaped.flatten()
print("\\nFlattened:", flattened)`,
                    explanation: 'reshape() 要求新形状的元素总数与原数组相同。'
                }
            ]
        },
        {
            id: 'math-operations',
            title: '数学运算',
            description: 'NumPy 支持元素级运算、广播机制和丰富的数学函数。',
            concepts: [
                {
                    name: '元素级运算',
                    explanation: '算术运算符（+, -, *, /）默认进行元素级运算，不是矩阵运算。',
                    math: '(\\mathbf{A} + \\mathbf{B})_{ij} = A_{ij} + B_{ij}'
                },
                {
                    name: '广播机制',
                    explanation: '当两个数组形状不同时，NumPy 会自动扩展较小的数组以匹配较大数组的形状。',
                    math: '\\mathbf{A}_{m \\times n} + \\mathbf{b}_{1 \\times n} = \\mathbf{C}_{m \\times n}'
                },
                {
                    name: '线性代数',
                    explanation: 'NumPy 提供矩阵乘法（@或dot）、转置、行列式、特征值等线性代数运算。',
                    math: '\\mathbf{C} = \\mathbf{A} \\mathbf{B}, \\quad C_{ij} = \\sum_{k} A_{ik} B_{kj}'
                }
            ],
            examples: [
                {
                    title: '基本运算',
                    code: `import numpy as np

a = np.array([1, 2, 3, 4])
b = np.array([5, 6, 7, 8])

print("a + b =", a + b)
print("a - b =", a - b)
print("a * b =", a * b)
print("a / b =", a / b)
print("a ** 2 =", a ** 2)`,
                    explanation: '所有运算都是元素对元素进行的。'
                },
                {
                    title: '广播示例',
                    code: `import numpy as np

# 矩阵加标量
arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Array:\\n", arr)
print("\\n+ 10:\\n", arr + 10)

# 矩阵加向量
vec = np.array([1, 2, 3])
print("\\n+ Vector [1,2,3]:\\n", arr + vec)`,
                    explanation: '标量和向量会自动广播到矩阵的每一行。'
                },
                {
                    title: '统计函数',
                    code: `import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Array:\\n", arr)

print("\\nSum:", np.sum(arr))
print("Mean:", np.mean(arr))
print("Std:", np.std(arr))
print("Max:", np.max(arr))
print("Min:", np.min(arr))

# 按轴计算
print("\\nSum (axis=0):", np.sum(arr, axis=0))
print("Sum (axis=1):", np.sum(arr, axis=1))`,
                    explanation: 'axis=0 表示沿列方向（跨行），axis=1 表示沿行方向（跨列）。'
                },
                {
                    title: '线性代数运算',
                    code: `import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print("Matrix A:\\n", A)
print("\\nMatrix B:\\n", B)

# 矩阵乘法
print("\\nA @ B =\\n", A @ B)

# 转置
print("\\nA Transpose:\\n", A.T)

# 行列式
print("\\nDet(A):", np.linalg.det(A))

# 逆矩阵
print("\\nInv(A):\\n", np.linalg.inv(A))`,
                    explanation: '使用 @ 运算符或 np.dot() 进行矩阵乘法，linalg 模块提供线性代数函数。'
                }
            ]
        },
        {
            id: 'random',
            title: '随机数生成',
            description: 'NumPy 提供了强大的随机数生成功能，用于模拟和统计分析。',
            concepts: [
                {
                    name: '随机数生成器',
                    explanation: 'np.random 模块提供各种分布的随机数生成函数。',
                    math: 'X \\sim \\mathcal{N}(\\mu, \\sigma^2)'
                },
                {
                    name: '随机种子',
                    explanation: '设置随机种子可以使随机数生成可重复，便于调试和验证。',
                    math: '\\text{seed}(s) \\Rightarrow \\text{reproducible sequence}'
                }
            ],
            examples: [
                {
                    title: '基本随机数',
                    code: `import numpy as np

# 设置随机种子
np.random.seed(42)

# 0-1 均匀分布
uniform = np.random.random(5)
print("Uniform:", uniform)

# 指定范围的随机整数
integers = np.random.randint(0, 10, size=5)
print("Integers:", integers)

# 标准正态分布
normal = np.random.randn(5)
print("Normal:", normal)`,
                    explanation: 'random() 生成 [0,1) 的均匀分布，randn() 生成标准正态分布。'
                },
                {
                    title: '多维随机数组',
                    code: `import numpy as np

np.random.seed(42)

# 2x3 的随机数组
arr = np.random.random((2, 3))
print("Random Array:\\n", arr)

# 正态分布数组
normal_arr = np.random.normal(loc=0, scale=1, size=(3, 3))
print("\\nNormal Array:\\n", normal_arr)`,
                    explanation: 'size 参数指定生成数组的形状。'
                },
                {
                    title: '随机选择和打乱',
                    code: `import numpy as np

np.random.seed(42)

arr = np.arange(10)
print("Original:", arr)

# 随机选择
choice = np.random.choice(arr, size=5, replace=False)
print("\\nChoice 5:", choice)

# 打乱数组
np.random.shuffle(arr)
print("Shuffled:", arr)`,
                    explanation: 'choice() 可以随机选择元素，shuffle() 原地打乱数组。'
                }
            ]
        }
    ]
}

const en = {
    ...common,
    title: 'NumPy',
    description: 'NumPy is the fundamental package for scientific computing in Python, providing high-performance multidimensional array objects and tools.',
    sections: [
        {
            id: 'array-basics',
            title: 'Array Basics',
            description: 'The core of NumPy is the ndarray (N-dimensional array) object, a fast and flexible container for large datasets.',
            concepts: [
                {
                    name: 'ndarray Creation',
                    explanation: 'ndarrays can be created in several ways: from Python lists, using built-in functions (zeros, ones, arange), etc.',
                    math: '\\mathbf{A} \\in \\mathbb{R}^{m \\times n}'
                },
                {
                    name: 'Array Properties',
                    explanation: 'Important attributes include: shape, dtype (data type), ndim (number of dimensions), and size (total elements).',
                    math: '\\text{shape} = (n_1, n_2, ..., n_k), \\quad \\text{size} = \\prod_{i=1}^{k} n_i'
                }
            ],
            examples: [
                {
                    title: 'Create 1D Array',
                    code: `import numpy as np

# Create array from list
arr = np.array([1, 2, 3, 4, 5])
print("Array:", arr)
print("Shape:", arr.shape)
print("Dtype:", arr.dtype)
print("NDim:", arr.ndim)`,
                    explanation: 'Create a NumPy array from a python list using np.array() and inspect its basic properties.'
                },
                {
                    title: 'Create 2D Array',
                    code: `import numpy as np

# Create 2x3 array
arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Array:\\n", arr)
print("Shape:", arr.shape)
print("Size:", arr.size)`,
                    explanation: '2D arrays are like matrices. The shape returns (rows, cols).'
                },
                {
                    title: 'Built-in Creation Functions',
                    code: `import numpy as np

# Create Zeros
zeros = np.zeros((3, 4))
print("Zeros:\\n", zeros)

# Create Ones
ones = np.ones((2, 3))
print("\\nOnes:\\n", ones)

# Create Arange
arange = np.arange(0, 10, 2)
print("\\nArange:", arange)

# Create Linspace
linspace = np.linspace(0, 1, 5)
print("Linspace:", linspace)`,
                    explanation: 'NumPy provides convenient functions to create arrays with specific patterns like zeros, ones, or ranges.'
                }
            ]
        },
        {
            id: 'array-operations',
            title: 'Array Operations',
            description: 'NumPy offers powerful indexing, slicing, and reshaping capabilities for efficient data access and modification.',
            concepts: [
                {
                    name: 'Indexing & Slicing',
                    explanation: 'Similar to Python lists but supports multi-dimensional, boolean, and integer array indexing. Slices are views of the original array.',
                    math: 'A[i, j] \\text{ access element at row } i \\text{ col } j'
                },
                {
                    name: 'Reshaping',
                    explanation: 'reshape() changes the shape of an array without changing its data. flatten() converts multidimensional arrays to 1D.',
                    math: '\\mathbf{A}_{m \\times n} \\xrightarrow{\\text{reshape}} \\mathbf{B}_{p \\times q}, \\quad mn = pq'
                }
            ],
            examples: [
                {
                    title: 'Array Indexing',
                    code: `import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("Array:\\n", arr)

# Access element
print("\\narr[0, 0] =", arr[0, 0])
print("arr[1, 2] =", arr[1, 2])

# Access row
print("\\nRow 0:", arr[0, :])

# Access col
print("Col 1:", arr[:, 1])`,
                    explanation: 'Use [row, col] syntax to access elements. Colon ":" selects entire range for that axis.'
                },
                {
                    title: 'Array Slicing',
                    code: `import numpy as np

arr = np.arange(12).reshape(3, 4)
print("Array:\\n", arr)

# First 2 rows
print("\\nFirst 2 rows:\\n", arr[:2, :])

# Last 2 cols
print("\\nLast 2 cols:\\n", arr[:, 2:])

# Submatrix
print("\\nSubmatrix:\\n", arr[1:3, 1:3])`,
                    explanation: 'Slicing returns a view of the original array. Modifying the slice affects the original data.'
                },
                {
                    title: 'Array Reshaping',
                    code: `import numpy as np

arr = np.arange(12)
print("Array:", arr)

# Reshape to 3x4
reshaped = arr.reshape(3, 4)
print("\\n3x4 Array:\\n", reshaped)

# Reshape to 2x6
reshaped2 = arr.reshape(2, 6)
print("\\n2x6 Array:\\n", reshaped2)

# Flatten
flattened = reshaped.flatten()
print("\\nFlattened:", flattened)`,
                    explanation: 'reshape() requires the total number of elements to match. Compatible shapes are required.'
                }
            ]
        },
        {
            id: 'math-operations',
            title: 'Math Operations',
            description: 'Support for element-wise operations, broadcasting, and linear algebra.',
            concepts: [
                {
                    name: 'Element-wise Operations',
                    explanation: 'Arithmetic operators (+, -, *, /) work element-wise by default.',
                    math: '(\\mathbf{A} + \\mathbf{B})_{ij} = A_{ij} + B_{ij}'
                },
                {
                    name: 'Broadcasting',
                    explanation: 'NumPy treats arrays with different shapes during arithmetic operations by automatically expanding the smaller one.',
                    math: '\\mathbf{A}_{m \\times n} + \\mathbf{b}_{1 \\times n} = \\mathbf{C}_{m \\times n}'
                },
                {
                    name: 'Linear Algebra',
                    explanation: 'Matrix multiplication (@ or dot), transposition, determinants, and eigenvalues are supported via the linalg module.',
                    math: '\\mathbf{C} = \\mathbf{A} \\mathbf{B}, \\quad C_{ij} = \\sum_{k} A_{ik} B_{kj}'
                }
            ],
            examples: [
                {
                    title: 'Basic Arithmetic',
                    code: `import numpy as np

a = np.array([1, 2, 3, 4])
b = np.array([5, 6, 7, 8])

print("a + b =", a + b)
print("a - b =", a - b)
print("a * b =", a * b)
print("a / b =", a / b)
print("a ** 2 =", a ** 2)`,
                    explanation: 'Basic operations are applied element-by-element.'
                },
                {
                    title: 'Broadcasting Example',
                    code: `import numpy as np

# Matrix + scalar
arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Array:\\n", arr)
print("\\n+ 10:\\n", arr + 10)

# Matrix + vector
vec = np.array([1, 2, 3])
print("\\n+ Vector [1,2,3]:\\n", arr + vec)`,
                    explanation: 'Scalars and vectors are broadcast to match the dimensions of larger matrices.'
                },
                {
                    title: 'Statistical Functions',
                    code: `import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Array:\\n", arr)

print("\\nSum:", np.sum(arr))
print("Mean:", np.mean(arr))
print("Std:", np.std(arr))
print("Max:", np.max(arr))
print("Min:", np.min(arr))

# Axis operations
print("\\nSum (axis=0):", np.sum(arr, axis=0))
print("Sum (axis=1):", np.sum(arr, axis=1))`,
                    explanation: 'Functions like sum, mean, std reduce dimensions unless an axis is specified.'
                },
                {
                    title: 'Linear Algebra',
                    code: `import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print("Matrix A:\\n", A)
print("\\nMatrix B:\\n", B)

# Matrix multiplication
print("\\nA @ B =\\n", A @ B)

# Transpose
print("\\nA Transpose:\\n", A.T)

# Determinant
print("\\nDet(A):", np.linalg.det(A))

# Inverse
print("\\nInv(A):\\n", np.linalg.inv(A))`,
                    explanation: 'Use @ for matrix multiplication. The linalg module provides advanced solvers.'
                }
            ]
        },
        {
            id: 'random',
            title: 'Random Number Generation',
            description: 'Generate random numbers for simulations and statistical analysis.',
            concepts: [
                {
                    name: 'Random Generator',
                    explanation: 'np.random module provides functions for Uniform, Normal, and other distributions.',
                    math: 'X \\sim \\mathcal{N}(\\mu, \\sigma^2)'
                },
                {
                    name: 'Random Seed',
                    explanation: 'Setting a seed ensures reproducibility of random sequences.',
                    math: '\\text{seed}(s) \\Rightarrow \\text{reproducible sequence}'
                }
            ],
            examples: [
                {
                    title: 'Basic Random Numbers',
                    code: `import numpy as np

# Set seed
np.random.seed(42)

# Uniform
uniform = np.random.random(5)
print("Uniform:", uniform)

# Randint
integers = np.random.randint(0, 10, size=5)
print("Integers:", integers)

# Normal
normal = np.random.randn(5)
print("Normal:", normal)`,
                    explanation: 'Generate random floats in [0,1), standard normal values, or random integers.'
                },
                {
                    title: 'Random Arrays',
                    code: `import numpy as np

np.random.seed(42)

# Random 2x3
arr = np.random.random((2, 3))
print("Random Array:\\n", arr)

# Normal Array
normal_arr = np.random.normal(loc=0, scale=1, size=(3, 3))
print("\\nNormal Array:\\n", normal_arr)`,
                    explanation: 'Most random functions accept a size argument to generate multi-dimensional arrays directly.'
                },
                {
                    title: 'Shuffle & Choice',
                    code: `import numpy as np

np.random.seed(42)

arr = np.arange(10)
print("Original:", arr)

# Choice
choice = np.random.choice(arr, size=5, replace=False)
print("\\nChoice 5:", choice)

# Shuffle
np.random.shuffle(arr)
print("Shuffled:", arr)`,
                    explanation: 'choice picks random elements; shuffle randomizes the array order in-place.'
                }
            ]
        }
    ]
}

export default { zh, en }
