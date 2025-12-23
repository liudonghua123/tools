const common = {
    id: 'pandas',
    icon: '🐼'
}

const zh = {
    ...common,
    title: 'Pandas',
    description: 'Pandas 是 Python 数据分析的核心库，提供高效的数据结构和数据分析工具。',
    sections: [
        {
            id: 'data-structures',
            title: '数据结构',
            description: 'Pandas 的两个核心数据结构是 Series（一维）和 DataFrame（二维）。',
            concepts: [
                {
                    name: 'Series',
                    explanation: 'Series 是带标签的一维数组，类似于字典或带索引的列表。',
                    math: 'S = \\{(i_k, v_k)\\}_{k=1}^{n}'
                },
                {
                    name: 'DataFrame',
                    explanation: 'DataFrame 是二维表格数据结构，有行索引和列索引。',
                    math: 'D \\in \\mathbb{R}^{m \\times n}, \\text{ with row and column labels}'
                }
            ],
            examples: [
                {
                    title: 'Series 基础',
                    code: `import pandas as pd
import numpy as np

# 从列表创建 Series
s1 = pd.Series([1, 2, 3, 4, 5])
print("Series 1:")
print(s1)

# 带自定义索引
s2 = pd.Series([10, 20, 30], index=['a', 'b', 'c'])
print("\\nSeries 2 (自定义索引):")
print(s2)

# 从字典创建
s3 = pd.Series({'北京': 2154, '上海': 2424, '广州': 1404})
print("\\nSeries 3 (城市人口，万人):")
print(s3)

# 访问元素
print("\\n上海人口:", s3['上海'], "万人")`,
                    explanation: 'Series 可以从列表、数组或字典创建，支持标签索引。'
                },
                {
                    title: 'DataFrame 基础',
                    code: `import pandas as pd

# 从字典创建 DataFrame
data = {
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, 30, 35, 28],
    '城市': ['北京', '上海', '广州', '深圳'],
    '工资': [8000, 12000, 10000, 9500]
}
df = pd.DataFrame(data)
print("DataFrame:")
print(df)

# 查看基本信息
print("\\n形状:", df.shape)
print("列名:", df.columns.tolist())
print("\\n前 2 行:")
print(df.head(2))`,
                    explanation: 'DataFrame 类似于 Excel 表格，每列可以是不同的数据类型。'
                },
                {
                    title: '数据选择',
                    code: `import pandas as pd

data = {
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, 30, 35, 28],
    '工资': [8000, 12000, 10000, 9500]
}
df = pd.DataFrame(data)

# 选择列
print("工资列:")
print(df['工资'])

# 选择多列
print("\\n姓名和工资:")
print(df[['姓名', '工资']])

# 选择行（按位置）
print("\\n第一行:")
print(df.iloc[0])

# 选择行（按标签）
print("\\n前两行:")
print(df.loc[0:1])

# 条件选择
print("\\n工资大于 9000 的员工:")
print(df[df['工资'] > 9000])`,
                    explanation: '使用 [] 选择列，iloc 按位置选择，loc 按标签选择，支持条件筛选。'
                }
            ]
        },
        {
            id: 'data-cleaning',
            title: '数据清洗',
            description: '数据清洗包括处理缺失值、重复值和数据类型转换。',
            concepts: [
                {
                    name: '缺失值',
                    explanation: 'Pandas 使用 NaN 表示缺失值，提供多种方法处理缺失数据。',
                    math: '\\text{NaN} \\in \\text{missing values}'
                },
                {
                    name: '数据转换',
                    explanation: '可以转换数据类型、重命名列、替换值等。',
                    math: 'f: D \\to D\''
                }
            ],
            examples: [
                {
                    title: '处理缺失值',
                    code: `import pandas as pd
import numpy as np

# 创建含缺失值的 DataFrame
data = {
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, np.nan, 35, 28],
    '工资': [8000, 12000, np.nan, 9500]
}
df = pd.DataFrame(data)
print("原始数据:")
print(df)

# 检查缺失值
print("\\n缺失值统计:")
print(df.isnull().sum())

# 删除含缺失值的行
df_dropped = df.dropna()
print("\\n删除缺失值后:")
print(df_dropped)

# 填充缺失值
df_filled = df.fillna({'年龄': df['年龄'].mean(), '工资': 0})
print("\\n填充缺失值后:")
print(df_filled)`,
                    explanation: 'isnull() 检测缺失值，dropna() 删除，fillna() 填充。'
                },
                {
                    title: '处理重复值',
                    code: `import pandas as pd

# 创建含重复的 DataFrame
data = {
    '姓名': ['张三', '李四', '张三', '王五'],
    '年龄': [25, 30, 25, 35]
}
df = pd.DataFrame(data)
print("原始数据:")
print(df)

# 检查重复
print("\\n重复行:")
print(df.duplicated())

# 删除重复
df_unique = df.drop_duplicates()
print("\\n删除重复后:")
print(df_unique)

# 保留最后一个重复项
df_last = df.drop_duplicates(keep='last')
print("\\n保留最后一个:")
print(df_last)`,
                    explanation: 'duplicated() 检测重复，drop_duplicates() 删除重复行。'
                },
                {
                    title: '数据类型转换',
                    code: `import pandas as pd

data = {
    '编号': ['1', '2', '3', '4'],
    '价格': ['100.5', '200.3', '150.0', '180.8'],
    '日期': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04']
}
df = pd.DataFrame(data)
print("原始数据类型:")
print(df.dtypes)

# 转换类型
df['编号'] = df['编号'].astype(int)
df['价格'] = df['价格'].astype(float)
df['日期'] = pd.to_datetime(df['日期'])

print("\\n转换后的数据类型:")
print(df.dtypes)
print("\\n转换后的数据:")
print(df)`,
                    explanation: 'astype() 转换数据类型，to_datetime() 转换为日期时间类型。'
                }
            ]
        },
        {
            id: 'data-analysis',
            title: '数据分析',
            description: 'Pandas 提供强大的数据分组、聚合和统计分析功能。',
            concepts: [
                {
                    name: '分组聚合',
                    explanation: 'groupby() 按指定列分组，然后对每组应用聚合函数。',
                    math: '\\text{GroupBy}: D \\to \\{G_1, G_2, ..., G_k\\} \\to \\text{Aggregate}'
                },
                {
                    name: '数据透视',
                    explanation: 'pivot_table() 创建数据透视表，类似于 Excel 的数据透视表。',
                    math: '\\text{Pivot}: D \\to D_{\\text{summary}}'
                }
            ],
            examples: [
                {
                    title: '分组聚合',
                    code: `import pandas as pd

data = {
    '部门': ['销售', '技术', '销售', '技术', '销售', '技术'],
    '姓名': ['张三', '李四', '王五', '赵六', '钱七', '孙八'],
    '工资': [8000, 12000, 9000, 11000, 8500, 13000]
}
df = pd.DataFrame(data)
print("原始数据:")
print(df)

# 按部门分组求平均工资
avg_salary = df.groupby('部门')['工资'].mean()
print("\\n各部门平均工资:")
print(avg_salary)

# 多个聚合函数
stats = df.groupby('部门')['工资'].agg(['mean', 'min', 'max', 'count'])
print("\\n各部门工资统计:")
print(stats)`,
                    explanation: 'groupby() 分组后可以应用 mean, sum, count 等聚合函数。'
                },
                {
                    title: '数据透视表',
                    code: `import pandas as pd

data = {
    '日期': ['2024-01', '2024-01', '2024-02', '2024-02', '2024-01', '2024-02'],
    '产品': ['A', 'B', 'A', 'B', 'A', 'B'],
    '销量': [100, 150, 120, 180, 110, 160],
    '收入': [10000, 15000, 12000, 18000, 11000, 16000]
}
df = pd.DataFrame(data)
print("原始数据:")
print(df)

# 创建数据透视表
pivot = pd.pivot_table(df, values='销量', index='日期', columns='产品', aggfunc='sum')
print("\\n销量透视表:")
print(pivot)

# 多个值
pivot2 = pd.pivot_table(df, values=['销量', '收入'], index='日期', columns='产品', aggfunc='sum')
print("\\n销量和收入透视表:")
print(pivot2)`,
                    explanation: 'pivot_table() 重组数据，index 为行，columns 为列，values 为值。'
                },
                {
                    title: '统计分析',
                    code: `import pandas as pd
import numpy as np

np.random.seed(42)
data = {
    '数学': np.random.randint(60, 100, 10),
    '英语': np.random.randint(60, 100, 10),
    '物理': np.random.randint(60, 100, 10)
}
df = pd.DataFrame(data)
print("学生成绩:")
print(df)

# 描述性统计
print("\\n描述性统计:")
print(df.describe())

# 相关系数
print("\\n相关系数矩阵:")
print(df.corr())

# 各科平均分
print("\\n各科平均分:")
print(df.mean())

# 总分和排名
df['总分'] = df.sum(axis=1)
df['排名'] = df['总分'].rank(ascending=False)
print("\\n添加总分和排名:")
print(df)`,
                    explanation: 'describe() 显示统计摘要，corr() 计算相关系数，rank() 计算排名。'
                }
            ]
        },
        {
            id: 'visualization',
            title: '数据可视化',
            description: 'Pandas 内置了基于 Matplotlib 的绘图功能。',
            concepts: [
                {
                    name: '内置绘图',
                    explanation: 'DataFrame 和 Series 都有 plot() 方法，可以快速创建各种图表。',
                    math: '\\text{DataFrame} \\xrightarrow{\\text{plot()}} \\text{Visualization}'
                }
            ],
            examples: [
                {
                    title: '线图和柱状图',
                    code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 创建时间序列数据
dates = pd.date_range('2024-01-01', periods=30, freq='D')
data = {
    '销售额': np.random.randint(1000, 5000, 30),
    '访问量': np.random.randint(500, 2000, 30)
}
df = pd.DataFrame(data, index=dates)

# 线图
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
df['销售额'].plot(title='每日销售额', ylabel='金额（元）', grid=True)

# 柱状图
plt.subplot(1, 2, 2)
df['访问量'].plot(kind='bar', title='每日访问量', ylabel='次数', grid=True)
plt.xticks([0, 9, 19, 29], ['1日', '10日', '20日', '30日'])

plt.tight_layout()
plt.show()

print("图表已生成")`,
                    explanation: 'plot() 默认绘制线图，kind 参数可指定其他图表类型。'
                },
                {
                    title: '分组可视化',
                    code: `import pandas as pd
import matplotlib.pyplot as plt

data = {
    '部门': ['销售', '技术', '销售', '技术', '销售', '技术'],
    '季度': ['Q1', 'Q1', 'Q2', 'Q2', 'Q3', 'Q3'],
    '业绩': [100, 150, 120, 180, 140, 200]
}
df = pd.DataFrame(data)

# 数据透视
pivot = df.pivot(index='季度', columns='部门', values='业绩')
print("业绩数据:")
print(pivot)

# 分组柱状图
plt.figure(figsize=(10, 5))
pivot.plot(kind='bar', title='各部门季度业绩对比', ylabel='业绩', rot=0)
plt.legend(title='部门')
plt.grid(axis='y', alpha=0.3)
plt.show()

print("对比图已生成")`,
                    explanation: '先用 pivot 重组数据，再绘制分组柱状图。'
                },
                {
                    title: '箱线图和散点图',
                    code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = {
    '数学': np.random.normal(75, 10, 50),
    '英语': np.random.normal(70, 15, 50),
    '物理': np.random.normal(80, 12, 50)
}
df = pd.DataFrame(data)

# 箱线图
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
df.plot(kind='box', title='各科成绩分布', ylabel='分数', grid=True)

# 散点图
plt.subplot(1, 2, 2)
df.plot(kind='scatter', x='数学', y='物理', title='数学 vs 物理', 
        s=50, alpha=0.6, grid=True)

plt.tight_layout()
plt.show()

print("分布图已生成")`,
                    explanation: 'kind="box" 绘制箱线图，kind="scatter" 绘制散点图。'
                }
            ]
        }
    ]
}

const en = {
    ...common,
    title: 'Pandas',
    description: 'Pandas is the core library for data analysis in Python, providing efficient data structures and analysis tools.',
    sections: [
        {
            id: 'data-structures',
            title: 'Data Structures',
            description: 'The two primary data structures of Pandas are Series (1D) and DataFrame (2D).',
            concepts: [
                {
                    name: 'Series',
                    explanation: 'Series is a labeled one-dimensional array, similar to a dictionary or an indexed list.',
                    math: 'S = \\{(i_k, v_k)\\}_{k=1}^{n}'
                },
                {
                    name: 'DataFrame',
                    explanation: 'DataFrame is a 2-dimensional tabular data structure with both row and column indices.',
                    math: 'D \\in \\mathbb{R}^{m \\times n}, \\text{ with row and column labels}'
                }
            ],
            examples: [
                {
                    title: 'Series Basics',
                    code: `import pandas as pd
import numpy as np

# Create Series from list
s1 = pd.Series([1, 2, 3, 4, 5])
print("Series 1:")
print(s1)

# With custom index
s2 = pd.Series([10, 20, 30], index=['a', 'b', 'c'])
print("\\nSeries 2 (custom index):")
print(s2)

# From dictionary
s3 = pd.Series({'Beijing': 2154, 'Shanghai': 2424, 'Guangzhou': 1404})
print("\\nSeries 3 (City Population):")
print(s3)

# Access element
print("\\nShanghai Population:", s3['Shanghai'])`,
                    explanation: 'Series can be created from lists, arrays, or dictionaries, and supports labeled indexing.'
                },
                {
                    title: 'DataFrame Basics',
                    code: `import pandas as pd

# Create DataFrame from dictionary
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [25, 30, 35, 28],
    'City': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen'],
    'Salary': [8000, 12000, 10000, 9500]
}
df = pd.DataFrame(data)
print("DataFrame:")
print(df)

# Basic info
print("\\nShape:", df.shape)
print("Columns:", df.columns.tolist())
print("\\nFirst 2 rows:")
print(df.head(2))`,
                    explanation: 'DataFrame is like an Excel spreadsheet where each column can be a different data type.'
                },
                {
                    title: 'Data Selection',
                    code: `import pandas as pd

data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [25, 30, 35, 28],
    'Salary': [8000, 12000, 10000, 9500]
}
df = pd.DataFrame(data)

# Select column
print("Salary Column:")
print(df['Salary'])

# Select multiple columns
print("\\nName and Salary:")
print(df[['Name', 'Salary']])

# Select row (by position)
print("\\nFirst Row:")
print(df.iloc[0])

# Select rows (by label/index)
print("\\nFirst two rows:")
print(df.loc[0:1])

# Conditional selection
print("\\nEmployees with Salary > 9000:")
print(df[df['Salary'] > 9000])`,
                    explanation: 'Use [] to select columns, iloc for position-based, loc for label-based selection, and boolean indexing.'
                }
            ]
        },
        {
            id: 'data-cleaning',
            title: 'Data Cleaning',
            description: 'Data cleaning involves handling missing values, duplicates, and data type conversions.',
            concepts: [
                {
                    name: 'Missing Values',
                    explanation: 'Pandas uses NaN for missing values and provides methods to handle them.',
                    math: '\\text{NaN} \\in \\text{missing values}'
                },
                {
                    name: 'Data Transformation',
                    explanation: 'You can convert data types, rename columns, replace values, etc.',
                    math: 'f: D \\to D\''
                }
            ],
            examples: [
                {
                    title: 'Handling Missing Values',
                    code: `import pandas as pd
import numpy as np

# DataFrame with missing values
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [25, np.nan, 35, 28],
    'Salary': [8000, 12000, np.nan, 9500]
}
df = pd.DataFrame(data)
print("Original Data:")
print(df)

# Check missing
print("\\nMissing count:")
print(df.isnull().sum())

# Drop missing
df_dropped = df.dropna()
print("\\nDropped missing:")
print(df_dropped)

# Fill missing
df_filled = df.fillna({'Age': df['Age'].mean(), 'Salary': 0})
print("\\nFilled missing:")
print(df_filled)`,
                    explanation: 'isnull() detects missing, dropna() removes them, fillna() fills them.'
                },
                {
                    title: 'Handling Duplicates',
                    code: `import pandas as pd

# DataFrame with duplicates
data = {
    'Name': ['Alice', 'Bob', 'Alice', 'Charlie'],
    'Age': [25, 30, 25, 35]
}
df = pd.DataFrame(data)
print("Original Data:")
print(df)

# Check duplicates
print("\\nDuplicate rows:")
print(df.duplicated())

# Drop duplicates
df_unique = df.drop_duplicates()
print("\\nDropped duplicates:")
print(df_unique)

# Keep last
df_last = df.drop_duplicates(keep='last')
print("\\nKeep last:")
print(df_last)`,
                    explanation: 'duplicated() finds duplicates, drop_duplicates() removes rows.'
                },
                {
                    title: 'Data Type Conversion',
                    code: `import pandas as pd

data = {
    'ID': ['1', '2', '3', '4'],
    'Price': ['100.5', '200.3', '150.0', '180.8'],
    'Date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04']
}
df = pd.DataFrame(data)
print("Original types:")
print(df.dtypes)

# Convert types
df['ID'] = df['ID'].astype(int)
df['Price'] = df['Price'].astype(float)
df['Date'] = pd.to_datetime(df['Date'])

print("\\nConverted types:")
print(df.dtypes)
print("\\nConverted data:")
print(df)`,
                    explanation: 'astype() converts types, to_datetime() handles dates.'
                }
            ]
        },
        {
            id: 'data-analysis',
            title: 'Data Analysis',
            description: 'Pandas offers powerful grouping, aggregation, and statistical analysis features.',
            concepts: [
                {
                    name: 'GroupBy',
                    explanation: 'groupby() groups data using a mapper or by a Series of columns.',
                    math: '\\text{GroupBy}: D \\to \\{G_1, G_2, ..., G_k\\} \\to \\text{Aggregate}'
                },
                {
                    name: 'Pivot Table',
                    explanation: 'pivot_table() creates a spreadsheet-style pivot table as a DataFrame.',
                    math: '\\text{Pivot}: D \\to D_{\\text{summary}}'
                }
            ],
            examples: [
                {
                    title: 'Grouping and Aggregation',
                    code: `import pandas as pd

data = {
    'Dept': ['Sales', 'Tech', 'Sales', 'Tech', 'Sales', 'Tech'],
    'Name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'],
    'Salary': [8000, 12000, 9000, 11000, 8500, 13000]
}
df = pd.DataFrame(data)
print("Original Data:")
print(df)

# Mean salary by Dept
avg_salary = df.groupby('Dept')['Salary'].mean()
print("\\nAverage Salary by Dept:")
print(avg_salary)

# Multiple aggregations
stats = df.groupby('Dept')['Salary'].agg(['mean', 'min', 'max', 'count'])
print("\\nSalary Stats by Dept:")
print(stats)`,
                    explanation: 'groupby() splits data into groups for applying functions like mean, sum, etc.'
                },
                {
                    title: 'Pivot Tables',
                    code: `import pandas as pd

data = {
    'Date': ['2024-01', '2024-01', '2024-02', '2024-02', '2024-01', '2024-02'],
    'Product': ['A', 'B', 'A', 'B', 'A', 'B'],
    'Sales': [100, 150, 120, 180, 110, 160],
    'Revenue': [10000, 15000, 12000, 18000, 11000, 16000]
}
df = pd.DataFrame(data)
print("Original Data:")
print(df)

# Create pivot table
pivot = pd.pivot_table(df, values='Sales', index='Date', columns='Product', aggfunc='sum')
print("\\nSales Pivot Table:")
print(pivot)

# Multiple values
pivot2 = pd.pivot_table(df, values=['Sales', 'Revenue'], index='Date', columns='Product', aggfunc='sum')
print("\\nSales & Revenue Pivot Table:")
print(pivot2)`,
                    explanation: 'pivot_table() reshapes data based on index/columns values.'
                },
                {
                    title: 'Statistical Analysis',
                    code: `import pandas as pd
import numpy as np

np.random.seed(42)
data = {
    'Math': np.random.randint(60, 100, 10),
    'English': np.random.randint(60, 100, 10),
    'Physics': np.random.randint(60, 100, 10)
}
df = pd.DataFrame(data)
print("Student Grades:")
print(df)

# Descriptive stats
print("\\nDescriptive Stats:")
print(df.describe())

# Correlation
print("\\nCorrelation Matrix:")
print(df.corr())

# Mean per subject
print("\\nMean per subject:")
print(df.mean())

# Total and Rank
df['Total'] = df.sum(axis=1)
df['Rank'] = df['Total'].rank(ascending=False)
print("\\nWith Total and Rank:")
print(df)`,
                    explanation: 'describe() gives summary stats, corr() for correlation, rank() for ranking.'
                }
            ]
        },
        {
            id: 'visualization',
            title: 'Data Visualization',
            description: 'Pandas has built-in plotting capabilities based on Matplotlib.',
            concepts: [
                {
                    name: 'Built-in Plotting',
                    explanation: 'DataFrame and Series have a plot() method for quick visualization.',
                    math: '\\text{DataFrame} \\xrightarrow{\\text{plot()}} \\text{Visualization}'
                }
            ],
            examples: [
                {
                    title: 'Line and Bar and Plots',
                    code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Time series data
dates = pd.date_range('2024-01-01', periods=30, freq='D')
data = {
    'Sales': np.random.randint(1000, 5000, 30),
    'Visits': np.random.randint(500, 2000, 30)
}
df = pd.DataFrame(data, index=dates)

# Line plot
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
df['Sales'].plot(title='Daily Sales', ylabel='Amount', grid=True)

# Bar plot
plt.subplot(1, 2, 2)
df['Visits'].plot(kind='bar', title='Daily Visits', ylabel='Count', grid=True)
plt.xticks([0, 9, 19, 29], ['1st', '10th', '20th', '30th'])

plt.tight_layout()
plt.show()

print("Charts generated")`,
                    explanation: 'plot() creates line plots default; kind specifies other types.'
                },
                {
                    title: 'Grouped Visualization',
                    code: `import pandas as pd
import matplotlib.pyplot as plt

data = {
    'Dept': ['Sales', 'Tech', 'Sales', 'Tech', 'Sales', 'Tech'],
    'Quarter': ['Q1', 'Q1', 'Q2', 'Q2', 'Q3', 'Q3'],
    'Performance': [100, 150, 120, 180, 140, 200]
}
df = pd.DataFrame(data)

# Pivot
pivot = df.pivot(index='Quarter', columns='Dept', values='Performance')
print("Performance Data:")
print(pivot)

# Grouped bar chart
plt.figure(figsize=(10, 5))
pivot.plot(kind='bar', title='Performance by Dept', ylabel='Score', rot=0)
plt.legend(title='Dept')
plt.grid(axis='y', alpha=0.3)
plt.show()

print("Comparison chart generated")`,
                    explanation: 'Pivot data first, then plot grouped bar charts.'
                },
                {
                    title: 'Box and Scatter Plots',
                    code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = {
    'Math': np.random.normal(75, 10, 50),
    'English': np.random.normal(70, 15, 50),
    'Physics': np.random.normal(80, 12, 50)
}
df = pd.DataFrame(data)

# Box plot
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
df.plot(kind='box', title='Grade Distribution', ylabel='Score', grid=True)

# Scatter plot
plt.subplot(1, 2, 2)
df.plot(kind='scatter', x='Math', y='Physics', title='Math vs Physics', 
        s=50, alpha=0.6, grid=True)

plt.tight_layout()
plt.show()

print("Distribution charts generated")`,
                    explanation: 'kind="box" for boxplots, kind="scatter" for scatter plots.'
                }
            ]
        }
    ]
}

export default { zh, en }
