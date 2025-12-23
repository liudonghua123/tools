const common = {
    id: 'sympy',
    icon: '∑'
}

const zh = {
    ...common,
    title: 'SymPy',
    description: 'SymPy 是 Python 的符号数学库，可以进行符号计算、代数运算、微积分等。',
    sections: [
        {
            id: 'symbolic-basics',
            title: '符号计算基础',
            description: 'SymPy 允许定义符号变量并进行精确的符号运算。',
            concepts: [
                {
                    name: '符号定义',
                    explanation: '使用 symbols() 定义符号变量，这些变量代表数学符号而非具体数值。',
                    math: 'x, y, z \\in \\text{Symbols}'
                },
                {
                    name: '表达式操作',
                    explanation: 'SymPy 可以对表达式进行化简、展开、因式分解等操作。',
                    math: 'f(x) = \\sum_{i=0}^{n} a_i x^i'
                }
            ],
            examples: [
                {
                    title: '定义符号和表达式',
                    code: `import sympy as sp
import sympy as sp

# 定义符号
x, y, z = sp.symbols('x y z')

# 创建表达式
expr = x**2 + 2*x + 1
print("表达式:", expr)

# 替换值
result = expr.subs(x, 3)
print("x=3 时的值:", result)

# 转换为数值
numeric = float(result)
print("数值结果:", numeric)`,
                    explanation: 'symbols() 创建符号变量，subs() 用于替换符号为具体值。'
                },
                {
                    title: '化简表达式',
                    code: `import sympy as sp

x = sp.Symbol('x')

# 化简
expr1 = sp.sin(x)**2 + sp.cos(x)**2
simplified = sp.simplify(expr1)
print("sin²(x) + cos²(x) =", simplified)

# 三角化简
expr2 = sp.sin(2*x)
trig_simplified = sp.trigsimp(sp.expand_trig(expr2))
print("\\nsin(2x) 展开:", sp.expand_trig(expr2))

# 有理化简
expr3 = (x**2 - 1)/(x - 1)
rational = sp.simplify(expr3)
print("\\n(x²-1)/(x-1) =", rational)`,
                    explanation: 'simplify() 尝试化简表达式，trigsimp() 专门用于三角函数化简。'
                },
                {
                    title: '展开和因式分解',
                    code: `import sympy as sp

x, y = sp.symbols('x y')

# 展开
expr = (x + y)**3
expanded = sp.expand(expr)
print("(x+y)³ 展开:", expanded)

# 因式分解
expr2 = x**2 - y**2
factored = sp.factor(expr2)
print("\\nx² - y² 因式分解:", factored)

# 多项式展开
expr3 = (x + 1)*(x + 2)*(x + 3)
expanded3 = sp.expand(expr3)
print("\\n(x+1)(x+2)(x+3) =", expanded3)

# 再因式分解回去
factored3 = sp.factor(expanded3)
print("因式分解:", factored3)`,
                    explanation: 'expand() 展开表达式，factor() 进行因式分解。'
                }
            ]
        },
        {
            id: 'calculus',
            title: '微积分',
            description: 'SymPy 可以进行符号微分和积分运算。',
            concepts: [
                {
                    name: '求导',
                    explanation: 'diff() 函数计算符号导数，支持多阶导数和偏导数。',
                    math: '\\frac{d}{dx}f(x), \\quad \\frac{\\partial}{\\partial x}f(x,y)'
                },
                {
                    name: '积分',
                    explanation: 'integrate() 计算不定积分和定积分。',
                    math: '\\int f(x)dx, \\quad \\int_a^b f(x)dx'
                },
                {
                    name: '极限',
                    explanation: 'limit() 计算函数的极限值。',
                    math: '\\lim_{x \\to a} f(x)'
                }
            ],
            examples: [
                {
                    title: '求导数',
                    code: `import sympy as sp

x = sp.Symbol('x')

# 一阶导数
f = x**3 + 2*x**2 + x + 1
df = sp.diff(f, x)
print("f(x) =", f)
print("f'(x) =", df)

# 二阶导数
d2f = sp.diff(f, x, 2)
print("f''(x) =", d2f)

# 三角函数导数
g = sp.sin(x) * sp.exp(x)
dg = sp.diff(g, x)
print("\\nd/dx[sin(x)·eˣ] =", dg)`,
                    explanation: 'diff(f, x) 对 x 求一阶导，diff(f, x, n) 求 n 阶导。'
                },
                {
                    title: '偏导数',
                    code: `import sympy as sp

x, y = sp.symbols('x y')

# 多元函数
f = x**2 * y + x * y**2
print("f(x,y) =", f)

# 偏导数
df_dx = sp.diff(f, x)
df_dy = sp.diff(f, y)
print("\\n∂f/∂x =", df_dx)
print("∂f/∂y =", df_dy)

# 二阶混合偏导
d2f_dxdy = sp.diff(f, x, y)
print("\\n∂²f/∂x∂y =", d2f_dxdy)`,
                    explanation: '对多元函数可以分别对不同变量求偏导。'
                },
                {
                    title: '积分',
                    code: `import sympy as sp

x = sp.Symbol('x')

# 不定积分
f = x**2
F = sp.integrate(f, x)
print("∫ x² dx =", F)

# 定积分
definite = sp.integrate(f, (x, 0, 1))
print("\\n∫₀¹ x² dx =", definite)

# 复杂函数积分
g = sp.sin(x) * sp.exp(x)
G = sp.integrate(g, x)
print("\\n∫ sin(x)·eˣ dx =", G)

# 多重积分
h = x * y
H = sp.integrate(h, (x, 0, 1), (y, 0, 1))
print("\\n∫₀¹∫₀¹ xy dx dy =", H)`,
                    explanation: 'integrate(f, x) 求不定积分，integrate(f, (x, a, b)) 求定积分。'
                },
                {
                    title: '极限',
                    code: `import sympy as sp

x = sp.Symbol('x')

# 基本极限
f = sp.sin(x) / x
limit1 = sp.limit(f, x, 0)
print("lim(x→0) sin(x)/x =", limit1)

# 无穷极限
g = (1 + 1/x)**x
limit2 = sp.limit(g, x, sp.oo)
print("\\nlim(x→∞) (1+1/x)ˣ =", limit2)

# 单侧极限
h = 1/x
limit_right = sp.limit(h, x, 0, '+')
limit_left = sp.limit(h, x, 0, '-')
print("\\nlim(x→0⁺) 1/x =", limit_right)
print("lim(x→0⁻) 1/x =", limit_left)`,
                    explanation: 'limit(f, x, a) 计算 x 趋向 a 时的极限，sp.oo 表示无穷大。'
                }
            ]
        },
        {
            id: 'equations',
            title: '方程求解',
            description: 'SymPy 可以求解代数方程、方程组和微分方程。',
            concepts: [
                {
                    name: '代数方程',
                    explanation: 'solve() 函数求解代数方程的符号解。',
                    math: 'f(x) = 0 \\Rightarrow x = ?'
                },
                {
                    name: '方程组',
                    explanation: '可以求解多个方程组成的线性或非线性方程组。',
                    math: '\\begin{cases} f_1(x,y) = 0 \\\\ f_2(x,y) = 0 \\end{cases}'
                }
            ],
            examples: [
                {
                    title: '求解方程',
                    code: `import sympy as sp

x = sp.Symbol('x')

# 一元一次方程
eq1 = 2*x + 3 - 7
sol1 = sp.solve(eq1, x)
print("2x + 3 = 7")
print("解:", sol1)

# 一元二次方程
eq2 = x**2 - 5*x + 6
sol2 = sp.solve(eq2, x)
print("\\nx² - 5x + 6 = 0")
print("解:", sol2)

# 三角方程
eq3 = sp.sin(x) - sp.Rational(1, 2)
sol3 = sp.solve(eq3, x)
print("\\nsin(x) = 1/2")
print("解:", sol3)`,
                    explanation: 'solve(equation, variable) 返回方程的所有解。'
                },
                {
                    title: '方程组',
                    code: `import sympy as sp

x, y = sp.symbols('x y')

# 线性方程组
eq1 = 2*x + y - 5
eq2 = x - y - 1
sol = sp.solve([eq1, eq2], [x, y])
print("方程组:")
print("2x + y = 5")
print("x - y = 1")
print("解:", sol)

# 非线性方程组
eq3 = x**2 + y**2 - 25
eq4 = x - y - 1
sol2 = sp.solve([eq3, eq4], [x, y])
print("\\n非线性方程组:")
print("x² + y² = 25")
print("x - y = 1")
print("解:", sol2)`,
                    explanation: '传入方程列表和变量列表可以求解方程组。'
                },
                {
                    title: '微分方程',
                    code: `import sympy as sp

x = sp.Symbol('x')
y = sp.Function('y')

# 一阶微分方程: y' = y
eq1 = sp.Eq(y(x).diff(x), y(x))
sol1 = sp.dsolve(eq1, y(x))
print("y' = y")
print("通解:", sol1)

# 二阶微分方程: y'' + y = 0
eq2 = sp.Eq(y(x).diff(x, 2) + y(x), 0)
sol2 = sp.dsolve(eq2, y(x))
print("\\ny'' + y = 0")
print("通解:", sol2)`,
                    explanation: 'dsolve() 求解微分方程，返回通解。'
                }
            ]
        },
        {
            id: 'matrices',
            title: '矩阵运算',
            description: 'SymPy 提供符号矩阵运算功能。',
            concepts: [
                {
                    name: '矩阵操作',
                    explanation: 'Matrix 类支持矩阵的基本运算和符号计算。',
                    math: '\\mathbf{A} \\in \\mathbb{R}^{m \\times n}'
                },
                {
                    name: '特征值',
                    explanation: '可以计算矩阵的特征值和特征向量。',
                    math: '\\mathbf{A}\\mathbf{v} = \\lambda\\mathbf{v}'
                }
            ],
            examples: [
                {
                    title: '矩阵基本运算',
                    code: `import sympy as sp

# 创建矩阵
A = sp.Matrix([[1, 2], [3, 4]])
B = sp.Matrix([[5, 6], [7, 8]])

print("矩阵 A:")
print(A)
print("\\n矩阵 B:")
print(B)

# 矩阵加法
print("\\nA + B =")
print(A + B)

# 矩阵乘法
print("\\nA * B =")
print(A * B)

# 转置
print("\\nA 的转置:")
print(A.T)`,
                    explanation: 'Matrix() 创建矩阵，支持加减乘除和转置运算。'
                },
                {
                    title: '行列式和逆矩阵',
                    code: `import sympy as sp

A = sp.Matrix([[1, 2], [3, 4]])
print("矩阵 A:")
print(A)

# 行列式
det_A = A.det()
print("\\ndet(A) =", det_A)

# 逆矩阵
inv_A = A.inv()
print("\\nA⁻¹ =")
print(inv_A)

# 验证
print("\\nA * A⁻¹ =")
print(A * inv_A)`,
                    explanation: 'det() 计算行列式，inv() 计算逆矩阵。'
                },
                {
                    title: '特征值和特征向量',
                    code: `import sympy as sp

A = sp.Matrix([[3, 1], [1, 3]])
print("矩阵 A:")
print(A)

# 特征值
eigenvals = A.eigenvals()
print("\\n特征值:", eigenvals)

# 特征向量
eigenvects = A.eigenvects()
print("\\n特征值和特征向量:")
for eigenval, multiplicity, eigenvect in eigenvects:
    print(f"λ = {eigenval}, 重数 = {multiplicity}")
    print(f"特征向量: {eigenvect}")`,
                    explanation: 'eigenvals() 返回特征值，eigenvects() 返回特征值和对应的特征向量。'
                }
            ]
        }
    ]
}

const en = {
    ...common,
    title: 'SymPy',
    description: 'SymPy is a Python library for symbolic mathematics, capable of symbolic computation, algebraic operations, calculus, etc.',
    sections: [
        {
            id: 'symbolic-basics',
            title: 'Symbolic Basics',
            description: 'SymPy allows defining symbolic variables and performing precise symbolic calculations.',
            concepts: [
                {
                    name: 'Symbol Definitions',
                    explanation: 'Use symbols() to define symbolic variables that represent mathematical symbols rather than specific values.',
                    math: 'x, y, z \\in \\text{Symbols}'
                },
                {
                    name: 'Expression Manipulation',
                    explanation: 'SymPy can simplify, expand, and factorize expressions.',
                    math: 'f(x) = \\sum_{i=0}^{n} a_i x^i'
                }
            ],
            examples: [
                {
                    title: 'Define Symbols and Expressions',
                    code: `import sympy as sp

# Define symbols
x, y, z = sp.symbols('x y z')

# Create expression
expr = x**2 + 2*x + 1
print("Expression:", expr)

# Substitute value
result = expr.subs(x, 3)
print("Value at x=3:", result)

# Convert to numeric
numeric = float(result)
print("Numeric result:", numeric)`,
                    explanation: 'symbols() creates symbolic variables, subs() substitutes variables with specific values.'
                },
                {
                    title: 'Simplify Expressions',
                    code: `import sympy as sp

x = sp.Symbol('x')

# Simplify
expr1 = sp.sin(x)**2 + sp.cos(x)**2
simplified = sp.simplify(expr1)
print("sin²(x) + cos²(x) =", simplified)

# Trig simplification
expr2 = sp.sin(2*x)
trig_simplified = sp.trigsimp(sp.expand_trig(expr2))
print("\\nsin(2x) expanded:", sp.expand_trig(expr2))

# Rational simplification
expr3 = (x**2 - 1)/(x - 1)
rational = sp.simplify(expr3)
print("\\n(x²-1)/(x-1) =", rational)`,
                    explanation: 'simplify() attempts to simplify expressions, trigsimp() targets trigonometric simplifications.'
                },
                {
                    title: 'Expand and Factor',
                    code: `import sympy as sp

x, y = sp.symbols('x y')

# Expand
expr = (x + y)**3
expanded = sp.expand(expr)
print("(x+y)³ expanded:", expanded)

# Factor
expr2 = x**2 - y**2
factored = sp.factor(expr2)
print("\\nx² - y² factored:", factored)

# Polynomial expansion
expr3 = (x + 1)*(x + 2)*(x + 3)
expanded3 = sp.expand(expr3)
print("\\n(x+1)(x+2)(x+3) =", expanded3)

# Factor back
factored3 = sp.factor(expanded3)
print("Factored:", factored3)`,
                    explanation: 'expand() expands expressions, factor() performs factorization.'
                }
            ]
        },
        {
            id: 'calculus',
            title: 'Calculus',
            description: 'SymPy can perform symbolic differentiation and integration.',
            concepts: [
                {
                    name: 'Differentiation',
                    explanation: 'diff() computes symbolic derivatives, supporting higher-order and partial derivatives.',
                    math: '\\frac{d}{dx}f(x), \\quad \\frac{\\partial}{\\partial x}f(x,y)'
                },
                {
                    name: 'Integration',
                    explanation: 'integrate() computes indefinite and definite integrals.',
                    math: '\\int f(x)dx, \\quad \\int_a^b f(x)dx'
                },
                {
                    name: 'Limits',
                    explanation: 'limit() computes limits of functions.',
                    math: '\\lim_{x \\to a} f(x)'
                }
            ],
            examples: [
                {
                    title: 'Differentiation',
                    code: `import sympy as sp

x = sp.Symbol('x')

# First derivative
f = x**3 + 2*x**2 + x + 1
df = sp.diff(f, x)
print("f(x) =", f)
print("f'(x) =", df)

# Second derivative
d2f = sp.diff(f, x, 2)
print("f''(x) =", d2f)

# Trig derivative
g = sp.sin(x) * sp.exp(x)
dg = sp.diff(g, x)
print("\\nd/dx[sin(x)·eˣ] =", dg)`,
                    explanation: 'diff(f, x) for first derivative, diff(f, x, n) for n-th derivative.'
                },
                {
                    title: 'Partial Derivatives',
                    code: `import sympy as sp

x, y = sp.symbols('x y')

# Multivariable function
f = x**2 * y + x * y**2
print("f(x,y) =", f)

# Partial derivatives
df_dx = sp.diff(f, x)
df_dy = sp.diff(f, y)
print("\\n∂f/∂x =", df_dx)
print("∂f/∂y =", df_dy)

# Mixed partial
d2f_dxdy = sp.diff(f, x, y)
print("\\n∂²f/∂x∂y =", d2f_dxdy)`,
                    explanation: 'You can compute partial derivatives with respect to different variables.'
                },
                {
                    title: 'Integration',
                    code: `import sympy as sp

x = sp.Symbol('x')

# Indefinite integral
f = x**2
F = sp.integrate(f, x)
print("∫ x² dx =", F)

# Definite integral
definite = sp.integrate(f, (x, 0, 1))
print("\\n∫₀¹ x² dx =", definite)

# Complex function integral
g = sp.sin(x) * sp.exp(x)
G = sp.integrate(g, x)
print("\\n∫ sin(x)·eˣ dx =", G)

# Multiple integrals
h = x * y
H = sp.integrate(h, (x, 0, 1), (y, 0, 1))
print("\\n∫₀¹∫₀¹ xy dx dy =", H)`,
                    explanation: 'integrate(f, x) for indefinite, integrate(f, (x, a, b)) for definite integrals.'
                },
                {
                    title: 'Limits',
                    code: `import sympy as sp

x = sp.Symbol('x')

# Basic limit
f = sp.sin(x) / x
limit1 = sp.limit(f, x, 0)
print("lim(x→0) sin(x)/x =", limit1)

# Infinite limit
g = (1 + 1/x)**x
limit2 = sp.limit(g, x, sp.oo)
print("\\nlim(x→∞) (1+1/x)ˣ =", limit2)

# One-sided limits
h = 1/x
limit_right = sp.limit(h, x, 0, '+')
limit_left = sp.limit(h, x, 0, '-')
print("\\nlim(x→0⁺) 1/x =", limit_right)
print("lim(x→0⁻) 1/x =", limit_left)`,
                    explanation: 'limit(f, x, a) computes limit as x approaches a. sp.oo represents infinity.'
                }
            ]
        },
        {
            id: 'equations',
            title: 'Equation Solving',
            description: 'SymPy can solve algebraic equations, systems of equations, and differential equations.',
            concepts: [
                {
                    name: 'Algebraic Equations',
                    explanation: 'solve() finds symbolic solutions for algebraic equations.',
                    math: 'f(x) = 0 \\Rightarrow x = ?'
                },
                {
                    name: 'Systems of Equations',
                    explanation: 'Solve linear or non-linear systems of equations.',
                    math: '\\begin{cases} f_1(x,y) = 0 \\\\ f_2(x,y) = 0 \\end{cases}'
                }
            ],
            examples: [
                {
                    title: 'Solving Equations',
                    code: `import sympy as sp

x = sp.Symbol('x')

# Linear equation
eq1 = 2*x + 3 - 7
sol1 = sp.solve(eq1, x)
print("2x + 3 = 7")
print("Solution:", sol1)

# Quadratic equation
eq2 = x**2 - 5*x + 6
sol2 = sp.solve(eq2, x)
print("\\nx² - 5x + 6 = 0")
print("Solution:", sol2)

# Trig equation
eq3 = sp.sin(x) - sp.Rational(1, 2)
sol3 = sp.solve(eq3, x)
print("\\nsin(x) = 1/2")
print("Solution:", sol3)`,
                    explanation: 'solve(equation, variable) returns all solutions.'
                },
                {
                    title: 'Systems of Equations',
                    code: `import sympy as sp

x, y = sp.symbols('x y')

# Linear system
eq1 = 2*x + y - 5
eq2 = x - y - 1
sol = sp.solve([eq1, eq2], [x, y])
print("System:")
print("2x + y = 5")
print("x - y = 1")
print("Solution:", sol)

# Non-linear system
eq3 = x**2 + y**2 - 25
eq4 = x - y - 1
sol2 = sp.solve([eq3, eq4], [x, y])
print("\\nNon-linear System:")
print("x² + y² = 25")
print("x - y = 1")
print("Solution:", sol2)`,
                    explanation: 'Pass a list of equations and variables to solve systems.'
                },
                {
                    title: 'Differential Equations',
                    code: `import sympy as sp

x = sp.Symbol('x')
y = sp.Function('y')

# First order ODE: y' = y
eq1 = sp.Eq(y(x).diff(x), y(x))
sol1 = sp.dsolve(eq1, y(x))
print("y' = y")
print("General Solution:", sol1)

# Second order ODE: y'' + y = 0
eq2 = sp.Eq(y(x).diff(x, 2) + y(x), 0)
sol2 = sp.dsolve(eq2, y(x))
print("\\ny'' + y = 0")
print("General Solution:", sol2)`,
                    explanation: 'dsolve() solves differential equations returning the general solution.'
                }
            ]
        },
        {
            id: 'matrices',
            title: 'Matrix Operations',
            description: 'SymPy provides symbolic matrix operations.',
            concepts: [
                {
                    name: 'Matrix Operations',
                    explanation: 'Matrix class supports basic arithmetic and symbolic computations on matrices.',
                    math: '\\mathbf{A} \\in \\mathbb{R}^{m \\times n}'
                },
                {
                    name: 'Eigenvalues',
                    explanation: 'Compute eigenvalues and eigenvectors of matrices.',
                    math: '\\mathbf{A}\\mathbf{v} = \\lambda\\mathbf{v}'
                }
            ],
            examples: [
                {
                    title: 'Basic Matrix Ops',
                    code: `import sympy as sp

# Create matrices
A = sp.Matrix([[1, 2], [3, 4]])
B = sp.Matrix([[5, 6], [7, 8]])

print("Matrix A:")
print(A)
print("\\nMatrix B:")
print(B)

# Addition
print("\\nA + B =")
print(A + B)

# Multiplication
print("\\nA * B =")
print(A * B)

# Transpose
print("\\nA Transpose:")
print(A.T)`,
                    explanation: 'Matrix() creates matrices, supporting addition, multiplication, and transposition.'
                },
                {
                    title: 'Determinant and Inverse',
                    code: `import sympy as sp

A = sp.Matrix([[1, 2], [3, 4]])
print("Matrix A:")
print(A)

# Determinant
det_A = A.det()
print("\\ndet(A) =", det_A)

# Inverse
inv_A = A.inv()
print("\\nA⁻¹ =")
print(inv_A)

# Verify
print("\\nA * A⁻¹ =")
print(A * inv_A)`,
                    explanation: 'det() computes determinant, inv() computes inverse.'
                },
                {
                    title: 'Eigenvalues/Vectors',
                    code: `import sympy as sp

A = sp.Matrix([[3, 1], [1, 3]])
print("Matrix A:")
print(A)

# Eigenvalues
eigenvals = A.eigenvals()
print("\\nEigenvalues:", eigenvals)

# Eigenvectors
eigenvects = A.eigenvects()
print("\\nEigenvalues and Eigenvectors:")
for eigenval, multiplicity, eigenvect in eigenvects:
    print(f"λ = {eigenval}, Multiplicity = {multiplicity}")
    print(f"Eigenvector: {eigenvect}")`,
                    explanation: 'eigenvals() returns eigenvalues, eigenvects() returns eigenvalues and vectors.'
                }
            ]
        }
    ]
}

export default { zh, en }
