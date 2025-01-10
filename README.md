# TumDum Price Comparison Dashboard

## Overview

TumDum Price Comparison Dashboard is a web application designed to help restaurants analyze and compare their pricing between TumDum and other platforms like Zomato. This dashboard provides insights into potential savings, considering commissions, delivery fees, discounts, and more.

## Features

- **Order Details Input:** Enter details about your restaurant and dishes, including menu price, listed price on Zomato, commissions, discounts, and delivery distance.

- **Price Recommendations:** Receive recommended pricing for TumDum to maximize your earnings based on customizable profit margins.

- **Detailed Price Comparison:** Compare customer prices and restaurant earnings between TumDum and Zomato in real-time.

- **Profit Visualization:** Visualize how your profits scale with order volume through interactive charts.

- **Save and Manage Analyses:** Save your pricing analyses for future reference and access your saved records in the Records section.

## Getting Started

### Prerequisites

- **Node.js** (version 14 or later)
- **npm** or **yarn**
- **Supabase Account:** For database services to store analysis records.

### Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/mewtyunjay/tumdum-dashboard.git
    cd tumdum-dashboard
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Configure Environment Variables:**

    Create a `.env` file in the root directory and add your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4. **Run the Development Server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. **Access the Dashboard:**

    Open [http://localhost:3000](http://localhost:3000) in your browser to use the dashboard.

## Usage

1. **Input Order Details:**

    Navigate to the dashboard and enter your restaurant name, dish name, menu price, Zomato listed price, commission percentages, any applicable discounts, and delivery distance.

2. **View Recommendations:**

    The dashboard will calculate and display the recommended TumDum price based on your input and desired profit margin.

3. **Compare Prices:**

    View detailed comparisons between TumDum and Zomato, including customer prices, restaurant earnings, and additional fees.

4. **Analyze Profits:**

    Use the profit comparison chart to understand how your profits scale with different order volumes.

5. **Save Analysis:**

    Save your pricing analysis for future reference. Access your saved records in the Records section.

## Technologies Used

- **Next.js** - React framework for building server-side rendered applications.

- **React** - JavaScript library for building user interfaces.

- **Supabase** - Backend as a service for database management.

- **Recharts** - Charting library for data visualization.

- **Tailwind CSS** - Utility-first CSS framework for styling.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
2. **Create a New Branch** (`git checkout -b feature/YourFeature`)
3. **Commit Your Changes** (`git commit -m 'Add some feature'`)
4. **Push to the Branch** (`git push origin feature/YourFeature`)
5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or support, please contact [mabhijeet11@gmail.com](mailto:mabhijeet11@gmail.com).
