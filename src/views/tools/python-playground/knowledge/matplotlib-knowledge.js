const common = {
    id: 'matplotlib',
    icon: '📊'
}

const zh = {
    ...common,
    title: 'Matplotlib',
    description: 'Matplotlib 是 Python 最流行的绘图库，可以创建高质量的静态、动态和交互式可视化。',
    sections: [
        {
            id: 'basic-plotting',
            title: '基础绘图',
            description: 'Matplotlib 的核心是 pyplot 接口，提供类似 MATLAB 的绘图方式。',
            concepts: [
                {
                    name: '线图',
                    explanation: 'plot() 函数是最基本的绘图函数，用于绘制线图和散点图。',
                    math: 'y = f(x), \\quad x \\in [a, b]'
                },
                {
                    name: '图形元素',
                    explanation: '一个完整的图形包括：标题、坐标轴标签、图例、网格等元素。',
                    math: '\\text{Figure} \\supset \\text{Axes} \\supset \\text{Plot}'
                }
            ],
            examples: [
                {
                    title: '简单线图',
                    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)
y = np.sin(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y)
plt.title('Sine Function')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.grid(True, alpha=0.3)
plt.show()

print("图形已生成")`,
                    explanation: 'linspace 生成均匀分布的点，plot 绘制连续的线。'
                },
                {
                    title: '多条曲线',
                    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)
y1 = np.sin(x)
y2 = np.cos(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y1, label='sin(x)', linewidth=2)
plt.plot(x, y2, label='cos(x)', linewidth=2)
plt.title('Trigonometric Functions')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("图形已生成")`,
                    explanation: 'label 参数用于图例，legend() 显示图例。'
                },
                {
                    title: '散点图',
                    code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
x = np.random.randn(50)
y = np.random.randn(50)
colors = np.random.rand(50)
sizes = 1000 * np.random.rand(50)

plt.figure(figsize=(8, 6))
plt.scatter(x, y, c=colors, s=sizes, alpha=0.6, cmap='viridis')
plt.colorbar(label='Color Value')
plt.title('Scatter Plot Example')
plt.xlabel('X Axis')
plt.ylabel('Y Axis')
plt.grid(True, alpha=0.3)
plt.show()

print("散点图已生成")`,
                    explanation: 'scatter() 绘制散点图，c 控制颜色，s 控制大小，alpha 控制透明度。'
                },
                {
                    title: '子图',
                    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)

fig, axes = plt.subplots(2, 2, figsize=(10, 8))

axes[0, 0].plot(x, np.sin(x))
axes[0, 0].set_title('sin(x)')
axes[0, 0].grid(True, alpha=0.3)

axes[0, 1].plot(x, np.cos(x), 'r')
axes[0, 1].set_title('cos(x)')
axes[0, 1].grid(True, alpha=0.3)

axes[1, 0].plot(x, np.tan(x))
axes[1, 0].set_title('tan(x)')
axes[1, 0].set_ylim(-5, 5)
axes[1, 0].grid(True, alpha=0.3)

axes[1, 1].plot(x, np.exp(-x/5) * np.sin(x))
axes[1, 1].set_title('Decaying Oscillation')
axes[1, 1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print("子图已生成")`,
                    explanation: 'subplots() 创建多个子图，tight_layout() 自动调整间距。'
                }
            ]
        },
        {
            id: 'advanced-plots',
            title: '高级可视化',
            description: 'Matplotlib 支持多种图表类型，适用于不同的数据展示需求。',
            concepts: [
                {
                    name: '柱状图',
                    explanation: 'bar() 用于绘制柱状图，适合展示分类数据的比较。',
                    math: '\\text{categories} \\times \\text{values}'
                },
                {
                    name: '直方图',
                    explanation: 'hist() 用于显示数据分布，将连续数据分组到区间（bins）中。',
                    math: 'h_i = \\sum_{x_j \\in [b_i, b_{i+1})} 1'
                }
            ],
            examples: [
                {
                    title: '柱状图',
                    code: `import numpy as np
import matplotlib.pyplot as plt

categories = ['A', 'B', 'C', 'D', 'E']
values = [23, 45, 56, 78, 32]

plt.figure(figsize=(8, 5))
bars = plt.bar(categories, values, color=['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'])
plt.title('Bar Chart Example', fontsize=14, fontweight='bold')
plt.xlabel('Category')
plt.ylabel('Value')
plt.grid(axis='y', alpha=0.3)

# Add value labels
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height,
             f'{height}', ha='center', va='bottom')

plt.show()
print("柱状图已生成")`,
                    explanation: 'bar() 创建柱状图，可以自定义颜色和添加数值标签。'
                },
                {
                    title: '直方图',
                    code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = np.random.normal(100, 15, 1000)

plt.figure(figsize=(8, 5))
plt.hist(data, bins=30, color='skyblue', edgecolor='black', alpha=0.7)
plt.title('Normal Distribution Histogram')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.grid(axis='y', alpha=0.3)
plt.axvline(data.mean(), color='red', linestyle='--', linewidth=2, label=f'Mean: {data.mean():.2f}')
plt.legend()
plt.show()

print(f"Mean: {data.mean():.2f}")
print(f"Std Dev: {data.std():.2f}")`,
                    explanation: 'hist() 自动将数据分组，bins 参数控制组数。'
                },
                {
                    title: '饼图',
                    code: `import matplotlib.pyplot as plt

labels = ['Python', 'JavaScript', 'Java', 'C++', 'Others']
sizes = [35, 25, 20, 12, 8]
colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
explode = (0.1, 0, 0, 0, 0)  # Explode 1st slice

plt.figure(figsize=(8, 6))
plt.pie(sizes, explode=explode, labels=labels, colors=colors,
        autopct='%1.1f%%', shadow=True, startangle=90)
plt.title('Programming Language Usage')
plt.axis('equal')
plt.show()

print("饼图已生成")`,
                    explanation: 'pie() 创建饼图，autopct 显示百分比，explode 可以突出某些扇区。'
                },
                {
                    title: '箱线图',
                    code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = [np.random.normal(0, std, 100) for std in range(1, 5)]

plt.figure(figsize=(8, 5))
bp = plt.boxplot(data, labels=['A', 'B', 'C', 'D'], patch_artist=True)

# Custom colors
colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
for patch, color in zip(bp['boxes'], colors):
    patch.set_facecolor(color)
    patch.set_alpha(0.7)

plt.title('Box Plot Example')
plt.xlabel('Group')
plt.ylabel('Value')
plt.grid(axis='y', alpha=0.3)
plt.show()

print("箱线图已生成")`,
                    explanation: '箱线图显示数据的分布特征：中位数、四分位数、异常值等。'
                }
            ]
        },
        {
            id: 'customization',
            title: '样式定制',
            description: '通过样式、颜色、标记等定制图形外观。',
            concepts: [
                {
                    name: '线条样式',
                    explanation: '可以设置线条的颜色、宽度、样式（实线、虚线等）和标记。',
                    math: '\\text{style} = \\text{color} + \\text{marker} + \\text{linestyle}'
                },
                {
                    name: '颜色映射',
                    explanation: 'colormap 将数值映射到颜色，常用于热图和等高线图。',
                    math: 'c: \\mathbb{R} \\to \\text{RGB}'
                }
            ],
            examples: [
                {
                    title: '线条样式',
                    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)

plt.figure(figsize=(10, 6))
plt.plot(x, np.sin(x), 'r-', linewidth=2, label='Solid')
plt.plot(x, np.sin(x-0.5), 'b--', linewidth=2, label='Dashed')
plt.plot(x, np.sin(x-1), 'g-.', linewidth=2, label='Dash-dot')
plt.plot(x, np.sin(x-1.5), 'm:', linewidth=2, label='Dotted')
plt.plot(x, np.sin(x-2), 'ko-', markersize=4, label='Marker')

plt.title('Line Styles', fontsize=14)
plt.xlabel('x')
plt.ylabel('y')
plt.legend(loc='upper right')
plt.grid(True, alpha=0.3)
plt.show()

print("样式图已生成")`,
                    explanation: '线条样式字符串格式：[颜色][标记][线型]，如 "ro-" 表示红色圆点实线。'
                },
                {
                    title: '热图',
                    code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = np.random.rand(10, 10)

plt.figure(figsize=(8, 6))
im = plt.imshow(data, cmap='hot', interpolation='nearest')
plt.colorbar(im, label='Value')
plt.title('Heatmap Example')
plt.xlabel('X Axis')
plt.ylabel('Y Axis')

# Add text annotations
for i in range(10):
    for j in range(10):
        text = plt.text(j, i, f'{data[i, j]:.2f}',
                       ha="center", va="center", color="w", fontsize=8)

plt.show()
print("热图已生成")`,
                    explanation: 'imshow() 显示二维数组为图像，cmap 指定颜色映射方案。'
                },
                {
                    title: '等高线图',
                    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-3, 3, 100)
y = np.linspace(-3, 3, 100)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

plt.figure(figsize=(10, 4))

# Filled contour
plt.subplot(1, 2, 1)
plt.contourf(X, Y, Z, levels=20, cmap='viridis')
plt.colorbar(label='Z Value')
plt.title('Filled Contour')
plt.xlabel('X')
plt.ylabel('Y')

# Line contour
plt.subplot(1, 2, 2)
CS = plt.contour(X, Y, Z, levels=10, colors='black')
plt.clabel(CS, inline=True, fontsize=8)
plt.title('Line Contour')
plt.xlabel('X')
plt.ylabel('Y')

plt.tight_layout()
plt.show()

print("等高线图已生成")`,
                    explanation: 'contour() 绘制等高线，contourf() 填充等高线之间的区域。'
                }
            ]
        }
    ]
}

const en = {
    ...common,
    title: 'Matplotlib',
    description: 'Matplotlib is Python\'s most popular plotting library, used for creating high-quality static, animated, and interactive visualizations.',
    sections: [
        {
            id: 'basic-plotting',
            title: 'Basic Plotting',
            description: 'The core of Matplotlib is the pyplot interface, which provides a MATLAB-like way of plotting.',
            concepts: [
                {
                    name: 'Line Plot',
                    explanation: 'The plot() function is the most basic plotting function, used for line plots and scatter plots.',
                    math: 'y = f(x), \\quad x \\in [a, b]'
                },
                {
                    name: 'Figure Elements',
                    explanation: 'A complete plot includes: Title, axis labels, legend, grid, and other elements.',
                    math: '\\text{Figure} \\supset \\text{Axes} \\supset \\text{Plot}'
                }
            ],
            examples: [
                {
                    title: 'Simple Line Plot',
                    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)
y = np.sin(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y)
plt.title('Sine Function')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.grid(True, alpha=0.3)
plt.show()

print("Plot generated")`,
                    explanation: 'linspace generates evenly spaced points, plot draws a continuous line.'
                },
                {
                    title: 'Multiple Curves',
                    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)
y1 = np.sin(x)
y2 = np.cos(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y1, label='sin(x)', linewidth=2)
plt.plot(x, y2, label='cos(x)', linewidth=2)
plt.title('Trigonometric Functions')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Plot generated")`,
                    explanation: 'The label parameter is used for the legend, and legend() displays it.'
                },
                {
                    title: 'Scatter Plot',
                    code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
x = np.random.randn(50)
y = np.random.randn(50)
colors = np.random.rand(50)
sizes = 1000 * np.random.rand(50)

plt.figure(figsize=(8, 6))
plt.scatter(x, y, c=colors, s=sizes, alpha=0.6, cmap='viridis')
plt.colorbar(label='Color Value')
plt.title('Scatter Plot Example')
plt.xlabel('X Axis')
plt.ylabel('Y Axis')
plt.grid(True, alpha=0.3)
plt.show()

print("Scatter plot generated")`,
                    explanation: 'scatter() draws scatter plots. c controls color, s controls size, alpha controls transparency.'
                },
                {
                    title: 'Subplots',
                    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)

fig, axes = plt.subplots(2, 2, figsize=(10, 8))

axes[0, 0].plot(x, np.sin(x))
axes[0, 0].set_title('sin(x)')
axes[0, 0].grid(True, alpha=0.3)

axes[0, 1].plot(x, np.cos(x), 'r')
axes[0, 1].set_title('cos(x)')
axes[0, 1].grid(True, alpha=0.3)

axes[1, 0].plot(x, np.tan(x))
axes[1, 0].set_title('tan(x)')
axes[1, 0].set_ylim(-5, 5)
axes[1, 0].grid(True, alpha=0.3)

axes[1, 1].plot(x, np.exp(-x/5) * np.sin(x))
axes[1, 1].set_title('Decaying Oscillation')
axes[1, 1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print("Subplots generated")`,
                    explanation: 'subplots() creates multiple plots, tight_layout() automatically adjusts spacing.'
                }
            ]
        },
        {
            id: 'advanced-plots',
            title: 'Advanced Visualization',
            description: 'Matplotlib supports various chart types for different data presentation needs.',
            concepts: [
                {
                    name: 'Bar Chart',
                    explanation: 'bar() is used for bar charts, suitable for comparing categorical data.',
                    math: '\\text{categories} \\times \\text{values}'
                },
                {
                    name: 'Histogram',
                    explanation: 'hist() is used to show data distribution, grouping continuous data into bins.',
                    math: 'h_i = \\sum_{x_j \\in [b_i, b_{i+1})} 1'
                }
            ],
            examples: [
                {
                    title: 'Bar Chart',
                    code: `import numpy as np
import matplotlib.pyplot as plt

categories = ['A', 'B', 'C', 'D', 'E']
values = [23, 45, 56, 78, 32]

plt.figure(figsize=(8, 5))
bars = plt.bar(categories, values, color=['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'])
plt.title('Bar Chart Example', fontsize=14, fontweight='bold')
plt.xlabel('Category')
plt.ylabel('Value')
plt.grid(axis='y', alpha=0.3)

# Add value labels
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height,
             f'{height}', ha='center', va='bottom')

plt.show()
print("Bar chart generated")`,
                    explanation: 'bar() creates bar charts. You can customize colors and add value labels.'
                },
                {
                    title: 'Histogram',
                    code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = np.random.normal(100, 15, 1000)

plt.figure(figsize=(8, 5))
plt.hist(data, bins=30, color='skyblue', edgecolor='black', alpha=0.7)
plt.title('Normal Distribution Histogram')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.grid(axis='y', alpha=0.3)
plt.axvline(data.mean(), color='red', linestyle='--', linewidth=2, label=f'Mean: {data.mean():.2f}')
plt.legend()
plt.show()

print(f"Mean: {data.mean():.2f}")
print(f"Std Dev: {data.std():.2f}")`,
                    explanation: 'hist() groups data automatically. The bins parameter controls the number of groups.'
                },
                {
                    title: 'Pie Chart',
                    code: `import matplotlib.pyplot as plt

labels = ['Python', 'JavaScript', 'Java', 'C++', 'Others']
sizes = [35, 25, 20, 12, 8]
colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
explode = (0.1, 0, 0, 0, 0)  # Explode 1st slice

plt.figure(figsize=(8, 6))
plt.pie(sizes, explode=explode, labels=labels, colors=colors,
        autopct='%1.1f%%', shadow=True, startangle=90)
plt.title('Programming Language Usage')
plt.axis('equal')
plt.show()

print("Pie chart generated")`,
                    explanation: 'pie() creates pie charts. autopct displays percentages, explode highlights slices.'
                },
                {
                    title: 'Box Plot',
                    code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = [np.random.normal(0, std, 100) for std in range(1, 5)]

plt.figure(figsize=(8, 5))
bp = plt.boxplot(data, labels=['A', 'B', 'C', 'D'], patch_artist=True)

# Custom colors
colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
for patch, color in zip(bp['boxes'], colors):
    patch.set_facecolor(color)
    patch.set_alpha(0.7)

plt.title('Box Plot Example')
plt.xlabel('Group')
plt.ylabel('Value')
plt.grid(axis='y', alpha=0.3)
plt.show()

print("Box plot generated")`,
                    explanation: 'Box plots show data distribution characteristics: median, quartiles, outliers, etc.'
                }
            ]
        },
        {
            id: 'customization',
            title: 'Style Customization',
            description: 'customize plot appearance with styles, colors, markers, and more.',
            concepts: [
                {
                    name: 'Line Styles',
                    explanation: 'You can set line color, width, style (solid, dashed, etc.), and markers.',
                    math: '\\text{style} = \\text{color} + \\text{marker} + \\text{linestyle}'
                },
                {
                    name: 'Color Maps',
                    explanation: 'Colormaps map numerical values to colors, often used for heatmaps and contour plots.',
                    math: 'c: \\mathbb{R} \\to \\text{RGB}'
                }
            ],
            examples: [
                {
                    title: 'Line Styles',
                    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)

plt.figure(figsize=(10, 6))
plt.plot(x, np.sin(x), 'r-', linewidth=2, label='Solid')
plt.plot(x, np.sin(x-0.5), 'b--', linewidth=2, label='Dashed')
plt.plot(x, np.sin(x-1), 'g-.', linewidth=2, label='Dash-dot')
plt.plot(x, np.sin(x-1.5), 'm:', linewidth=2, label='Dotted')
plt.plot(x, np.sin(x-2), 'ko-', markersize=4, label='Marker')

plt.title('Line Styles', fontsize=14)
plt.xlabel('x')
plt.ylabel('y')
plt.legend(loc='upper right')
plt.grid(True, alpha=0.3)
plt.show()

print("Style plot generated")`,
                    explanation: 'Line style string format: [color][marker][linestyle], e.g., "ro-" for red dotted solid line.'
                },
                {
                    title: 'Heatmap',
                    code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = np.random.rand(10, 10)

plt.figure(figsize=(8, 6))
im = plt.imshow(data, cmap='hot', interpolation='nearest')
plt.colorbar(im, label='Value')
plt.title('Heatmap Example')
plt.xlabel('X Axis')
plt.ylabel('Y Axis')

# Add text annotations
for i in range(10):
    for j in range(10):
        text = plt.text(j, i, f'{data[i, j]:.2f}',
                       ha="center", va="center", color="w", fontsize=8)

plt.show()
print("Heatmap generated")`,
                    explanation: 'imshow() displays 2D arrays as images. cmap specifies the color map scheme.'
                },
                {
                    title: 'Contour Plot',
                    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-3, 3, 100)
y = np.linspace(-3, 3, 100)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

plt.figure(figsize=(10, 4))

# Filled contour
plt.subplot(1, 2, 1)
plt.contourf(X, Y, Z, levels=20, cmap='viridis')
plt.colorbar(label='Z Value')
plt.title('Filled Contour')
plt.xlabel('X')
plt.ylabel('Y')

# Line contour
plt.subplot(1, 2, 2)
CS = plt.contour(X, Y, Z, levels=10, colors='black')
plt.clabel(CS, inline=True, fontsize=8)
plt.title('Line Contour')
plt.xlabel('X')
plt.ylabel('Y')

plt.tight_layout()
plt.show()

print("Contour plot generated")`,
                    explanation: 'contour() draws contour lines, contourf() fills the regions between contour lines.'
                }
            ]
        }
    ]
}

export default { zh, en }
