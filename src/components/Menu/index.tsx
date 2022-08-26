import { languageList, useTranslation } from '@pancakeswap/localization'
import { Menu as UikitMenu } from '@pancakeswap/uikit'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import useTheme from 'hooks/useTheme'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { footerLinks } from './config/footerConfig'
import GlobalSettings from './GlobalSettings'
import { SettingsMode } from './GlobalSettings/types'
import { useMenuItems } from './hooks/useMenuItems'
import UserMenu from './UserMenu'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'

const Menu = (props) => {
  const { isDark, setTheme } = useTheme()
  const cakePriceUsd = useCakeBusdPrice()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()

  const menuItems = useMenuItems()

  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  return (
    <>
      <UikitMenu
        linkComponent={(linkProps) => {
          return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
        }}
        rightSide={
          <>
            <GlobalSettings mode={SettingsMode.GLOBAL} />
            <NetworkSwitcher />
            <UserMenu />
          </>
        }
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentLang={currentLanguage.code}
        langs={languageList}
        setLang={setLanguage}
        cakePriceUsd={cakePriceUsd}
        links={menuItems}
        subLinks={activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
        footerLinks={getFooterLinks}
        activeItem={activeMenuItem?.href}
        activeSubItem={activeSubMenuItem?.href}
        buyCakeLabel={t('Buy CAKE')}
        {...props}
      />
    </>
  )
}

export default Menu
