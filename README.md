# Visualizer

**Description:**  
This project is a **probability distribution visualizer** built using `Stdlib`, `ReactJS`, and `ChartJS`. It showcases how to leverage the **extensive mathematical and statistical capabilities of Stdlib** to generate and visualize **Binomial and Poisson distributions**.  

---

**Technologies Used:**  
- **Stdlib:** The core library powering the entire statistical computation and mathematical operations.  
- **ReactJS:** For building the **interactive user interface**.  
- **ChartJS:** For rendering the **dynamic distribution graphs**.  

---

**Key Features:**  
1. **Stdlib-Powered Statistical Computations:**  
    - Utilizes `Stdlib` functions like:  
        - `@stdlib/stats-base-dists-binomial-pmf`: To calculate the **probability mass function** for the Binomial distribution.  
        - `@stdlib/stats-base-dists-poisson-pmf`: To generate the **Poisson distribution values**.  
        - **Core mathematical operations** from `Stdlib`, including:  
            - `@stdlib/math-base-special-sqrt`: For square root calculations.  
            - `@stdlib/math-base-special-max`: To determine the maximum value for axis scaling.

2. **Dynamic Graph Rendering:**  
    - The project generates **real-time graphs** based on user inputs using `ChartJS`.  
    - Automatically scales and adjusts the graph based on the **calculated distribution values** from `Stdlib`.  

---

**How It Works:**  
- Users can **input the parameters** for Binomial or Poisson distribution.  
- The **distribution values are computed using Stdlib’s PMF functions**.  
- The results are rendered as interactive graphs with **ChartJS**.  
