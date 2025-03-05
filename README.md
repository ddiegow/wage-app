# Japan Wage Statistics Interactive Map

## Overview

A React web application that allows users to view 2023 wage data for the different prefectures in Japan. The app allows viewing data by prefecture or by industry.

## Features

### Prefecture view

In this view mode we can select a prefecture and navigate the different types of industry. When a type of industry is selected, the user will be presented with the different salaries and sample data size.

### Industry view

In this view mode we can select an industry and view a map colored according to salary ranges. When hovered over, the different prefectures will display a tooltip with the salary estimate for that area and the sample data size.

#### Note about sample data

The data was fetched from e-stat.go.jp. Some of the salary estimates are heavily influenced by the sample data size (for example, over 3,000,000 yen a month for dentists in Kagoshima) For this reason, I have included sample data size in order to better understand posible outliers.

## TODO

### Adaptive styling

Currently the web application is optimized for desktop computers. When viewed from a mobile phone it becomes very hard to read. I will adapt the styling and application design to better support mobile devices in the near future.