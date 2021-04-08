## Goal: 
To demonstrate a simple asset-wrapping system for 2 EVM based blockchains. 

## Epic: The Asset Wrapping System

## Roles/Definitions:
 - **External Asset**: a supported asset (in this case, Ether on the Goerli Testnet) that exists on a network other than where our Product is deployed
 - **User**: a person/entity that would like to use the wrapped version of the external asset in order to interact with our Product
 - **Product**: The good or service our Users would like to interact with to gain some sort of value. In this case, a smart contract that is deployed onto our Product Chain
 - **Company**: The owner of the Product(s)
 - **Product Chain**: The network where the Product is being hosted/deployed to 
 - **Admin**: a person/entity whose account has been assigned the ability to perform administrative smart contract functions (pause txs, mint new coins, etc). Responsible for the custodial wallet
 - **Custodial Wallet**: The Company-owned External Asset Wallet where Users will deposit their External Asset in exchange for a Wrapped Asset
 - **Wrapped Asset**: A 1:1 ERC20 token representation of an External Asset being held in the corresponding Custodial Wallet
 - **Wrapped Asset Account**: A mapping that has been established between the external asset owner's public address and their assigned address on the Product Chain

---

## User Stories
### Case: As a **User**, I should be able to create a Wrapped Asset Account that I can use to interact with the Product
 - GIVEN the **User** has a Metamask wallet set up on the Goerli testnet
 - WHEN that **User** successfully calls the `createWrappedEtherAccount` method on the `WrappedAssetAccountMapper` contract (deployed on the Goerli Testnet)
 - THEN the **User** will receive the **Custodial Wallet** address they can send their Goerli Ether to in order to receive it as a **Wrapped Asset** on the **Product Chain**
   - AND the **User** will receive a unique address on the **Product Chain** that will store their **Wrapped Asset** token holdings
 - EXPECT the `WrappedAssetAccountMapper` to have the **User's** address mapped correctly to a valid wallet address

### Case: As a User, I should be able to deposit my Ether into the Custodial Wallet and get the expected amount (after gas/service fees) credited to my Wrapped Asset balance
 - GIVEN the **User** has some amount of Ether in a Metamask wallet on the Goerli testnet
 - WHEN the **User** deposits some amount of Ether from the Goerli network into the designated Goerli **Custodial Wallet**
 - THEN the **User** receives the expected amount of Wrapped Ether credited to their **Wrapped Asset Account** for use with the product
 - EXPECT the `WrappedEtherToken`s Total Supply to be incremented/minted by the expected deposit amount

### Case: As a User, I should be able to see my balance of Wrapped Ether in my Wrapped Asset Account 
 - GIVEN the **User** has already established a **Wrapped Asset Account** mapping
 - WHEN that User successfully calls the `getBalance` method on the `WrappedEtherToken` contract (deployed on the **Product Chain**)
 - THEN the **User** will see the correct balance assigned to their account

### Case: As a User, I should be able to transfer my own Wrapped Ether from my Wrapped Asset Account to another User's Wrapped Ether address, and have each party be deducted/credited the expected amounts (after gas/service fees)
 - GIVEN **User1** has some balance of Wrapped Ether in their **Wrapped Asset Account**
   - AND **User2** has already established a **Wrapped Asset Account** mapping
 - WHEN **User1** sends some amount of Wrapped Ether to the **Wrapped Asset Account** address of **User2**
   - AND **User1** has a sufficient balance
 - THEN **User2** is credited the expected amount (after gas/service fees) into their **Wrapped Asset Account**
   - AND **User1** is deducted the expected amount from their Wrapped Ether holdings in their **Wrapped Asset Account**
 - EXPECT the `WrappedEtherToken` Total Supply to remain the same as it was before the transfer

### Case: As a User, I should be able to withdraw my Wrapped Ether back into my External Ether address
 - GIVEN the **User** has some minimum amount of Wrapped Ether in their **Wrapped Asset Account**
   - AND the **User** has already established a **Wrapped Asset Account** mapping
 - WHEN the **User** calls the `withdrawWrappedAsset` method on the `WrappedEtherToken` contract with the specified amount
   - AND the **User** has a sufficient balance to complete the transaction
 - THEN the **User** is deducted the expected amount from their Wrapped Ether holdings in their **Wrapped Asset Account**
   - AND the **User** is credited the expected amount into the **External Asset** (Ether on Goerli Testnet) address  
 - EXPECT the `WrappedEtherToken` Total Supply to have been burned by the expected withdrawal amount
