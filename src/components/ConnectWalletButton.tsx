import { Button, ButtonProps } from '@pancakeswap/uikit'
// eslint-disable-next-line import/extensions
import useCustomHook from 'hooks/useCustomHook'
import Trans from './Trans'

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { handleClick, buttonText } = useCustomHook()

  return (
    <Button onClick={() => handleClick()} {...props}>
      {children || <Trans>{buttonText}</Trans>}
    </Button>
  )
}

export default ConnectWalletButton
