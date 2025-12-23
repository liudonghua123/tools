const common = {
    id: 'scipy',
    icon: '🔬'
}

const zh = {
    ...common,
    title: 'SciPy',
    description: 'SciPy 是基于 NumPy 的科学计算库，提供优化、积分、插值、信号处理等高级功能。',
    sections: [
        {
            id: 'optimization',
            title: '优化',
            description: 'SciPy 提供多种优化算法，用于求解函数的最小值、最大值和根。',
            concepts: [
                {
                    name: '函数最小化',
                    explanation: 'minimize() 函数使用各种算法寻找函数的局部或全局最小值。',
                    math: '\\min_{x} f(x)'
                },
                {
                    name: '曲线拟合',
                    explanation: 'curve_fit() 用于将数据拟合到指定的函数模型。',
                    math: '\\min \\sum_i [y_i - f(x_i, \\mathbf{p})]^2'
                }
            ],
            examples: [
                {
                    title: '函数最小化',
                    code: `import numpy as np
from scipy import optimize

# 定义目标函数
def f(x):
    return x**2 + 10*np.sin(x)

# 寻找最小值
result = optimize.minimize(f, x0=0)
print("最小值点:", result.x[0])
print("最小值:", result.fun)

# 绘制函数
import matplotlib.pyplot as plt
x = np.linspace(-10, 10, 1000)
y = f(x)

plt.figure(figsize=(10, 4))
plt.plot(x, y, 'b-', linewidth=2, label='f(x) = x² + 10sin(x)')
plt.plot(result.x, result.fun, 'ro', markersize=10, label=f'Minimun ({result.x[0]:.2f}, {result.fun:.2f})')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.title('Function Optimization')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("优化完成")`,
                    explanation: 'minimize() 从初始点 x0 开始搜索最小值。'
                },
                {
                    title: '曲线拟合',
                    code: `import numpy as np
from scipy import optimize
import matplotlib.pyplot as plt

# 生成带噪声的数据
np.random.seed(42)
x_data = np.linspace(0, 4, 50)
y_data = 2.5 * np.sin(1.5 * x_data) + 1.0 + np.random.normal(0, 0.3, 50)

# 定义拟合函数
def func(x, a, b, c):
    return a * np.sin(b * x) + c

# 拟合
params, covariance = optimize.curve_fit(func, x_data, y_data)
a, b, c = params
print(f"拟合参数: a={a:.3f}, b={b:.3f}, c={c:.3f}")

# 绘制结果
x_fit = np.linspace(0, 4, 200)
y_fit = func(x_fit, a, b, c)

plt.figure(figsize=(10, 5))
plt.scatter(x_data, y_data, alpha=0.6, label='Raw Data')
plt.plot(x_fit, y_fit, 'r-', linewidth=2, label=f'Fitted: {a:.2f}sin({b:.2f}x) + {c:.2f}')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Curve Fitting')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("拟合完成")`,
                    explanation: 'curve_fit() 返回最优参数和协方差矩阵。'
                },
                {
                    title: '求解方程的根',
                    code: `import numpy as np
from scipy import optimize

# 定义方程
def equation(x):
    return x**3 - 2*x - 5

# 求根
root = optimize.root_scalar(equation, bracket=[2, 3])
print("方程 x³ - 2x - 5 = 0 的根:", root.root)
print("函数值:", equation(root.root))

# 多元方程组
def equations(vars):
    x, y = vars
    eq1 = x**2 + y**2 - 4
    eq2 = x - y - 1
    return [eq1, eq2]

# 求解
solution = optimize.root(equations, [1, 1])
print("\\n方程组的解:", solution.x)
print("验证:", equations(solution.x))`,
                    explanation: 'root_scalar() 求单变量方程的根，root() 求多元方程组的解。'
                }
            ]
        },
        {
            id: 'integration',
            title: '数值积分',
            description: 'SciPy 提供数值积分方法，用于计算定积分和求解微分方程。',
            concepts: [
                {
                    name: '定积分',
                    explanation: 'quad() 函数使用自适应积分算法计算一维定积分。',
                    math: '\\int_a^b f(x)dx'
                },
                {
                    name: '常微分方程',
                    explanation: 'solve_ivp() 求解初值问题的常微分方程。',
                    math: '\\frac{dy}{dt} = f(t, y), \\quad y(t_0) = y_0'
                }
            ],
            examples: [
                {
                    title: '数值积分',
                    code: `import numpy as np
from scipy import integrate

# 定义被积函数
def f(x):
    return np.sin(x)

# 计算定积分
result, error = integrate.quad(f, 0, np.pi)
print(f"∫₀^π sin(x)dx = {result:.6f}")
print(f"估计误差: {error:.2e}")

# 复杂函数积分
def g(x):
    return np.exp(-x**2)

result2, error2 = integrate.quad(g, 0, np.inf)
print(f"\\n∫₀^∞ e^(-x²)dx = {result2:.6f}")
print(f"理论值: {np.sqrt(np.pi)/2:.6f}")`,
                    explanation: 'quad() 返回积分值和误差估计，支持无穷区间。'
                },
                {
                    title: '二重积分',
                    code: `import numpy as np
from scipy import integrate

# 定义二元函数
def f(y, x):
    return x * y

# 计算二重积分 ∫₀¹∫₀¹ xy dx dy
result, error = integrate.dblquad(f, 0, 1, 0, 1)
print(f"∫₀¹∫₀¹ xy dx dy = {result:.6f}")
print(f"理论值: 0.25")

# 变限积分
def f2(y, x):
    return x**2 + y**2

result2, error2 = integrate.dblquad(f2, 0, 1, lambda x: 0, lambda x: x)
print(f"\\n∫₀¹∫₀ˣ (x²+y²) dy dx = {result2:.6f}")`,
                    explanation: 'dblquad() 计算二重积分，支持变限积分。'
                },
                {
                    title: '求解微分方程',
                    code: `import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

# 定义微分方程 dy/dt = -2y
def dydt(t, y):
    return -2 * y

# 初值条件
y0 = [1.0]
t_span = (0, 5)
t_eval = np.linspace(0, 5, 100)

# 求解
sol = solve_ivp(dydt, t_span, y0, t_eval=t_eval)

# 绘制结果
plt.figure(figsize=(10, 5))
plt.plot(sol.t, sol.y[0], 'b-', linewidth=2, label='Numeric Solution')
plt.plot(sol.t, np.exp(-2*sol.t), 'r--', linewidth=2, label='Exact Solution: e^(-2t)')
plt.xlabel('t')
plt.ylabel('y')
plt.title('ODE: dy/dt = -2y, y(0) = 1')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("微分方程求解完成")`,
                    explanation: 'solve_ivp() 求解初值问题，返回时间点和对应的解。'
                }
            ]
        },
        {
            id: 'interpolation',
            title: '插值',
            description: '插值用于在已知数据点之间估计未知值。',
            concepts: [
                {
                    name: '一维插值',
                    explanation: 'interp1d() 创建插值函数，支持线性、多项式、样条等方法。',
                    math: 'f(x) \\approx \\sum_i y_i L_i(x)'
                },
                {
                    name: '样条插值',
                    explanation: '样条插值使用分段多项式，保证平滑性。',
                    math: 'S(x) = \\sum_i c_i B_i(x)'
                }
            ],
            examples: [
                {
                    title: '一维插值',
                    code: `import numpy as np
from scipy import interpolate
import matplotlib.pyplot as plt

# 原始数据点
x = np.array([0, 1, 2, 3, 4, 5])
y = np.array([0, 1, 4, 2, 3, 5])

# 创建插值函数
f_linear = interpolate.interp1d(x, y, kind='linear')
f_cubic = interpolate.interp1d(x, y, kind='cubic')

# 生成密集点
x_new = np.linspace(0, 5, 100)
y_linear = f_linear(x_new)
y_cubic = f_cubic(x_new)

# 绘制
plt.figure(figsize=(10, 5))
plt.plot(x, y, 'o', markersize=8, label='Data Points')
plt.plot(x_new, y_linear, '-', label='Linear Interpolation')
plt.plot(x_new, y_cubic, '-', label='Cubic Interpolation')
plt.xlabel('x')
plt.ylabel('y')
plt.title('1D Interpolation')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("插值完成")`,
                    explanation: 'kind 参数指定插值方法：linear, quadratic, cubic 等。'
                },
                {
                    title: '样条插值',
                    code: `import numpy as np
from scipy import interpolate
import matplotlib.pyplot as plt

# 数据点
x = np.array([0, 1, 2, 3, 4, 5])
y = np.array([0, 3, 1, 4, 2, 5])

# B样条插值
tck = interpolate.splrep(x, y, s=0)
x_new = np.linspace(0, 5, 100)
y_new = interpolate.splev(x_new, tck)

# 绘制
plt.figure(figsize=(10, 5))
plt.plot(x, y, 'o', markersize=8, label='Data Points')
plt.plot(x_new, y_new, '-', linewidth=2, label='B-Spline')
plt.xlabel('x')
plt.ylabel('y')
plt.title('B-Spline Interpolation')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("样条插值完成")`,
                    explanation: 'splrep() 计算样条表示，splev() 在新点上求值。'
                },
                {
                    title: '二维插值',
                    code: `import numpy as np
from scipy import interpolate
import matplotlib.pyplot as plt

# 创建网格数据
x = np.linspace(0, 4, 5)
y = np.linspace(0, 4, 5)
X, Y = np.meshgrid(x, y)
Z = np.sin(X) * np.cos(Y)

# 二维插值
f = interpolate.interp2d(x, y, Z, kind='cubic')

# 密集网格
x_new = np.linspace(0, 4, 50)
y_new = np.linspace(0, 4, 50)
Z_new = f(x_new, y_new)

# 绘制
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.contourf(X, Y, Z, levels=15, cmap='viridis')
plt.colorbar()
plt.title('Original (5x5)')
plt.subplot(1, 2, 2)
plt.contourf(x_new, y_new, Z_new, levels=15, cmap='viridis')
plt.colorbar()
plt.title('Interpolated (50x50)')
plt.tight_layout()
plt.show()

print("二维插值完成")`,
                    explanation: 'interp2d() 进行二维插值，可以将粗糙网格插值到密集网格。'
                }
            ]
        },
        {
            id: 'signal',
            title: '信号处理',
            description: 'SciPy 提供信号处理工具，包括滤波、傅里叶变换等。',
            concepts: [
                {
                    name: '滤波器',
                    explanation: '滤波器用于去除信号中的噪声或特定频率成分。',
                    math: 'y[n] = \\sum_k h[k] x[n-k]'
                },
                {
                    name: '傅里叶变换',
                    explanation: 'FFT 将时域信号转换到频域，用于频谱分析。',
                    math: 'X(f) = \\int_{-\\infty}^{\\infty} x(t) e^{-i2\\pi ft} dt'
                }
            ],
            examples: [
                {
                    title: '生成和滤波信号',
                    code: `import numpy as np
from scipy import signal
import matplotlib.pyplot as plt

# 生成信号：低频 + 高频 + 噪声
t = np.linspace(0, 1, 1000)
sig = np.sin(2*np.pi*5*t) + 0.5*np.sin(2*np.pi*50*t) + 0.2*np.random.randn(1000)

# 设计低通滤波器
b, a = signal.butter(4, 0.1)
filtered = signal.filtfilt(b, a, sig)

# 绘制
plt.figure(figsize=(12, 5))
plt.subplot(2, 1, 1)
plt.plot(t[:200], sig[:200])
plt.title('Original Signal (Noisy)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)

plt.subplot(2, 1, 2)
plt.plot(t[:200], filtered[:200])
plt.title('Filtered Signal')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print("滤波完成")`,
                    explanation: 'butter() 设计 Butterworth 滤波器，filtfilt() 进行零相位滤波。'
                },
                {
                    title: '傅里叶变换',
                    code: `import numpy as np
from scipy.fft import fft, fftfreq
import matplotlib.pyplot as plt

# 生成信号
N = 1000
T = 1.0 / 800.0
t = np.linspace(0, N*T, N)
sig = np.sin(50*2*np.pi*t) + 0.5*np.sin(120*2*np.pi*t)

# FFT
yf = fft(sig)
xf = fftfreq(N, T)[:N//2]

# 绘制
plt.figure(figsize=(12, 5))
plt.subplot(2, 1, 1)
plt.plot(t[:200], sig[:200])
plt.title('Time Domain')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)

plt.subplot(2, 1, 2)
plt.plot(xf, 2.0/N * np.abs(yf[:N//2]))
plt.title('Frequency Domain (FFT)')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)
plt.xlim(0, 200)

plt.tight_layout()
plt.show()

print("FFT 完成，检测到频率: 50 Hz 和 120 Hz")`,
                    explanation: 'fft() 计算快速傅里叶变换，fftfreq() 生成对应的频率坐标。'
                },
                {
                    title: '卷积',
                    code: `import numpy as np
from scipy import signal
import matplotlib.pyplot as plt

# 定义信号和核
sig = np.array([1, 2, 3, 4, 5, 4, 3, 2, 1])
kernel = np.array([1, 1, 1]) / 3  # 移动平均

# 卷积
conv_result = signal.convolve(sig, kernel, mode='same')

# 绘制
plt.figure(figsize=(10, 5))
plt.plot(sig, 'o-', label='Original', linewidth=2, markersize=8)
plt.plot(conv_result, 's-', label='Convolved (Smoothed)', linewidth=2, markersize=8)
plt.title('Convolution (Moving Average)')
plt.xlabel('Sample')
plt.ylabel('Value')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("卷积完成")`,
                    explanation: 'convolve() 计算两个信号的卷积，mode 参数控制输出大小。'
                }
            ]
        }
    ]
}

const en = {
    ...common,
    title: 'SciPy',
    description: 'SciPy is a scientific computing library based on NumPy, providing advanced functions such as optimization, integration, interpolation, and signal processing.',
    sections: [
        {
            id: 'optimization',
            title: 'Optimization',
            description: 'SciPy provides various optimization algorithms for finding minima, maxima, and roots of functions.',
            concepts: [
                {
                    name: 'Function Minimization',
                    explanation: 'minimize() uses various algorithms to find local or global minima of functions.',
                    math: '\\min_{x} f(x)'
                },
                {
                    name: 'Curve Fitting',
                    explanation: 'curve_fit() fits data to a specified function model.',
                    math: '\\min \\sum_i [y_i - f(x_i, \\mathbf{p})]^2'
                }
            ],
            examples: [
                {
                    title: 'Function Minimization',
                    code: `import numpy as np
from scipy import optimize

# Define objective function
def f(x):
    return x**2 + 10*np.sin(x)

# Find minimum
result = optimize.minimize(f, x0=0)
print("Minimum point:", result.x[0])
print("Minimum value:", result.fun)

# Plot function
import matplotlib.pyplot as plt
x = np.linspace(-10, 10, 1000)
y = f(x)

plt.figure(figsize=(10, 4))
plt.plot(x, y, 'b-', linewidth=2, label='f(x) = x² + 10sin(x)')
plt.plot(result.x, result.fun, 'ro', markersize=10, label=f'Minimum ({result.x[0]:.2f}, {result.fun:.2f})')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.title('Function Optimization')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Optimization done")`,
                    explanation: 'minimize() searches for a minimum starting from x0.'
                },
                {
                    title: 'Curve Fitting',
                    code: `import numpy as np
from scipy import optimize
import matplotlib.pyplot as plt

# Generate noisy data
np.random.seed(42)
x_data = np.linspace(0, 4, 50)
y_data = 2.5 * np.sin(1.5 * x_data) + 1.0 + np.random.normal(0, 0.3, 50)

# Define model function
def func(x, a, b, c):
    return a * np.sin(b * x) + c

# Fit
params, covariance = optimize.curve_fit(func, x_data, y_data)
a, b, c = params
print(f"Fitted params: a={a:.3f}, b={b:.3f}, c={c:.3f}")

# Plot result
x_fit = np.linspace(0, 4, 200)
y_fit = func(x_fit, a, b, c)

plt.figure(figsize=(10, 5))
plt.scatter(x_data, y_data, alpha=0.6, label='Raw Data')
plt.plot(x_fit, y_fit, 'r-', linewidth=2, label=f'Fitted: {a:.2f}sin({b:.2f}x) + {c:.2f}')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Curve Fitting')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Fitting done")`,
                    explanation: 'curve_fit() returns optimal parameters and covariance matrix.'
                },
                {
                    title: 'Root Finding',
                    code: `import numpy as np
from scipy import optimize

# Define equation
def equation(x):
    return x**3 - 2*x - 5

# Find root
root = optimize.root_scalar(equation, bracket=[2, 3])
print("Root of x³ - 2x - 5 = 0:", root.root)
print("Function value:", equation(root.root))

# Systems of equations
def equations(vars):
    x, y = vars
    eq1 = x**2 + y**2 - 4
    eq2 = x - y - 1
    return [eq1, eq2]

# Solve
solution = optimize.root(equations, [1, 1])
print("\\nSystem solution:", solution.x)
print("Check:", equations(solution.x))`,
                    explanation: 'root_scalar() finds roots for scalar functions, root() for systems of equations.'
                }
            ]
        },
        {
            id: 'integration',
            title: 'Numerical Integration',
            description: 'SciPy provides numerical integration methods for computing definite integrals and solving differential equations.',
            concepts: [
                {
                    name: 'Definite Integrals',
                    explanation: 'quad() computes 1D definite integrals using adaptive quadrature.',
                    math: '\\int_a^b f(x)dx'
                },
                {
                    name: 'ODEs',
                    explanation: 'solve_ivp() solves initial value problems for ordinary differential equations.',
                    math: '\\frac{dy}{dt} = f(t, y), \\quad y(t_0) = y_0'
                }
            ],
            examples: [
                {
                    title: 'Numerical Integration',
                    code: `import numpy as np
from scipy import integrate

# Define integrand
def f(x):
    return np.sin(x)

# Compute definite integral
result, error = integrate.quad(f, 0, np.pi)
print(f"∫₀^π sin(x)dx = {result:.6f}")
print(f"Estimated Error: {error:.2e}")

# Complex integrand
def g(x):
    return np.exp(-x**2)

result2, error2 = integrate.quad(g, 0, np.inf)
print(f"\\n∫₀^∞ e^(-x²)dx = {result2:.6f}")
print(f"Theoretical: {np.sqrt(np.pi)/2:.6f}")`,
                    explanation: 'quad() returns the integral value and error estimate, supports infinite intervals.'
                },
                {
                    title: 'Double Integration',
                    code: `import numpy as np
from scipy import integrate

# Define 2 variable function from inner to outer
def f(y, x):
    return x * y

# Compute double integral ∫₀¹∫₀¹ xy dx dy
result, error = integrate.dblquad(f, 0, 1, 0, 1)
print(f"∫₀¹∫₀¹ xy dx dy = {result:.6f}")
print(f"Theoretical: 0.25")

# Variable limits
def f2(y, x):
    return x**2 + y**2

result2, error2 = integrate.dblquad(f2, 0, 1, lambda x: 0, lambda x: x)
print(f"\\n∫₀¹∫₀ˣ (x²+y²) dy dx = {result2:.6f}")`,
                    explanation: 'dblquad() computes double integrals, supporting variable limits.'
                },
                {
                    title: 'Solving ODEs',
                    code: `import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

# Define ODE: dy/dt = -2y
def dydt(t, y):
    return -2 * y

# Initial conditions
y0 = [1.0]
t_span = (0, 5)
t_eval = np.linspace(0, 5, 100)

# Solve
sol = solve_ivp(dydt, t_span, y0, t_eval=t_eval)

# Plot
plt.figure(figsize=(10, 5))
plt.plot(sol.t, sol.y[0], 'b-', linewidth=2, label='Numeric Solution')
plt.plot(sol.t, np.exp(-2*sol.t), 'r--', linewidth=2, label='Exact Solution: e^(-2t)')
plt.xlabel('t')
plt.ylabel('y')
plt.title('ODE: dy/dt = -2y, y(0) = 1')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("ODE solved")`,
                    explanation: 'solve_ivp() solves initial value problems, returns time points and solution values.'
                }
            ]
        },
        {
            id: 'interpolation',
            title: 'Interpolation',
            description: 'Interpolation estimates unknown values between known data points.',
            concepts: [
                {
                    name: '1D Interpolation',
                    explanation: 'interp1d() creates interpolation functions, supporting linear, polynomial, spline, etc.',
                    math: 'f(x) \\approx \\sum_i y_i L_i(x)'
                },
                {
                    name: 'Spline Interpolation',
                    explanation: 'Spline interpolation uses piecewise polynomials to ensure smoothness.',
                    math: 'S(x) = \\sum_i c_i B_i(x)'
                }
            ],
            examples: [
                {
                    title: '1D Interpolation',
                    code: `import numpy as np
from scipy import interpolate
import matplotlib.pyplot as plt

# Original data
x = np.array([0, 1, 2, 3, 4, 5])
y = np.array([0, 1, 4, 2, 3, 5])

# Create interpolation functions
f_linear = interpolate.interp1d(x, y, kind='linear')
f_cubic = interpolate.interp1d(x, y, kind='cubic')

# Generate dense points
x_new = np.linspace(0, 5, 100)
y_linear = f_linear(x_new)
y_cubic = f_cubic(x_new)

# Plot
plt.figure(figsize=(10, 5))
plt.plot(x, y, 'o', markersize=8, label='Data Points')
plt.plot(x_new, y_linear, '-', label='Linear Interpolation')
plt.plot(x_new, y_cubic, '-', label='Cubic Interpolation')
plt.xlabel('x')
plt.ylabel('y')
plt.title('1D Interpolation')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Interpolation done")`,
                    explanation: 'kind specifies the method: linear, quadratic, cubic, etc.'
                },
                {
                    title: 'Spline Interpolation',
                    code: `import numpy as np
from scipy import interpolate
import matplotlib.pyplot as plt

# Data points
x = np.array([0, 1, 2, 3, 4, 5])
y = np.array([0, 3, 1, 4, 2, 5])

# B-Spline
tck = interpolate.splrep(x, y, s=0)
x_new = np.linspace(0, 5, 100)
y_new = interpolate.splev(x_new, tck)

# Plot
plt.figure(figsize=(10, 5))
plt.plot(x, y, 'o', markersize=8, label='Data Points')
plt.plot(x_new, y_new, '-', linewidth=2, label='B-Spline')
plt.xlabel('x')
plt.ylabel('y')
plt.title('B-Spline Interpolation')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Spline interpolation done")`,
                    explanation: 'splrep() computes spline representation, splev() evaluates it.'
                },
                {
                    title: '2D Interpolation',
                    code: `import numpy as np
from scipy import interpolate
import matplotlib.pyplot as plt

# Create grid data
x = np.linspace(0, 4, 5)
y = np.linspace(0, 4, 5)
X, Y = np.meshgrid(x, y)
Z = np.sin(X) * np.cos(Y)

# 2D Interpolation
f = interpolate.interp2d(x, y, Z, kind='cubic')

# Dense grid
x_new = np.linspace(0, 4, 50)
y_new = np.linspace(0, 4, 50)
Z_new = f(x_new, y_new)

# Plot
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.contourf(X, Y, Z, levels=15, cmap='viridis')
plt.colorbar()
plt.title('Original (5x5)')
plt.subplot(1, 2, 2)
plt.contourf(x_new, y_new, Z_new, levels=15, cmap='viridis')
plt.colorbar()
plt.title('Interpolated (50x50)')
plt.tight_layout()
plt.show()

print("2D interpolation done")`,
                    explanation: 'interp2d() performs 2D interpolation.'
                }
            ]
        },
        {
            id: 'signal',
            title: 'Signal Processing',
            description: 'SciPy provides signal processing tools including filtering and Fourier transforms.',
            concepts: [
                {
                    name: 'Filters',
                    explanation: 'Filters remove noise or specific frequency components from signals.',
                    math: 'y[n] = \\sum_k h[k] x[n-k]'
                },
                {
                    name: 'Fourier Transform',
                    explanation: 'FFT converts time-domain signals to frequency domain for spectral analysis.',
                    math: 'X(f) = \\int_{-\\infty}^{\\infty} x(t) e^{-i2\\pi ft} dt'
                }
            ],
            examples: [
                {
                    title: 'Signal Filtering',
                    code: `import numpy as np
from scipy import signal
import matplotlib.pyplot as plt

# Generate signal: low freq + high freq + noise
t = np.linspace(0, 1, 1000)
sig = np.sin(2*np.pi*5*t) + 0.5*np.sin(2*np.pi*50*t) + 0.2*np.random.randn(1000)

# Design lowpass filter
b, a = signal.butter(4, 0.1)
filtered = signal.filtfilt(b, a, sig)

# Plot
plt.figure(figsize=(12, 5))
plt.subplot(2, 1, 1)
plt.plot(t[:200], sig[:200])
plt.title('Original Signal (Noisy)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)

plt.subplot(2, 1, 2)
plt.plot(t[:200], filtered[:200])
plt.title('Filtered Signal')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print("Filtering done")`,
                    explanation: 'butter() designs Butterworth filter, filtfilt() applies zero-phase filtering.'
                },
                {
                    title: 'Fourier Transform',
                    code: `import numpy as np
from scipy.fft import fft, fftfreq
import matplotlib.pyplot as plt

# Generate signal
N = 1000
T = 1.0 / 800.0
t = np.linspace(0, N*T, N)
sig = np.sin(50*2*np.pi*t) + 0.5*np.sin(120*2*np.pi*t)

# FFT
yf = fft(sig)
xf = fftfreq(N, T)[:N//2]

# Plot
plt.figure(figsize=(12, 5))
plt.subplot(2, 1, 1)
plt.plot(t[:200], sig[:200])
plt.title('Time Domain')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)

plt.subplot(2, 1, 2)
plt.plot(xf, 2.0/N * np.abs(yf[:N//2]))
plt.title('Frequency Domain (FFT)')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)
plt.xlim(0, 200)

plt.tight_layout()
plt.show()

print("FFT done, detected frequencies: 50 Hz and 120 Hz")`,
                    explanation: 'fft() computes the Fast Fourier Transform, fftfreq() generates frequency bins.'
                },
                {
                    title: 'Convolution',
                    code: `import numpy as np
from scipy import signal
import matplotlib.pyplot as plt

# Define signal and kernel
sig = np.array([1, 2, 3, 4, 5, 4, 3, 2, 1])
kernel = np.array([1, 1, 1]) / 3  # Moving average

# Convolve
conv_result = signal.convolve(sig, kernel, mode='same')

# Plot
plt.figure(figsize=(10, 5))
plt.plot(sig, 'o-', label='Original', linewidth=2, markersize=8)
plt.plot(conv_result, 's-', label='Convolved (Smoothed)', linewidth=2, markersize=8)
plt.title('Convolution (Moving Average)')
plt.xlabel('Sample')
plt.ylabel('Value')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Convolution done")`,
                    explanation: 'convolve() convolved two signals, mode controls output size.'
                }
            ]
        }
    ]
}

export default { zh, en }
