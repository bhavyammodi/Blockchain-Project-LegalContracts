**Blockchain Legal Contracts: Enabling Trust and Transparency**

This project demonstrates the implementation of blockchain technology in legal contracts, emphasizing transparency and security through decentralized systems. By leveraging smart contracts and blockchain technology, this project aims to enhance trust among parties involved in legal transactions.

**Requirements:**

- **Ganache CLI:** This project uses Ganache CLI as a local blockchain for development and testing purposes. You can install it using the following command:

  ```
  npm install ganache-cli@latest
  ```

- **Truffle:** Truffle is a popular development framework for Ethereum. Install Truffle with:

  ```
  npm install truffle
  ```

**Getting Started:**

1. **Clone the Repository:**
   ```
   git clone https://github.com/bhavyammodi/Blockchain-Project-LegalContracts
   cd Blockchain-Project-LegalContracts
   ```

2. **Install Dependencies:**
   ```
   npm install
   ```

3. **Start Ganache:**
   ```
   ganache-cli
   ```

   Ganache will provide you with a local Ethereum blockchain environment for development and testing.

4. **Compile and Migrate Contracts:**
   ```
   truffle migrate
   ```

   This will compile and deploy the smart contracts to the local Ganache blockchain.

5. **Run Tests:**
   ```
   npx truffle test
   ```

   Ensure that all tests pass successfully, validating the functionality of the implemented smart contracts.
