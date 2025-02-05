import React from 'react'
import { Button, ChevronRightIcon } from 'native-base'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const Secondarybutton = ({ icon, children, ...props }) => {
  const { t } = useTranslation()
  return (
    <Button
      isLoadingText={t('SUBMITTING')}
      {...props}
      background='white'
      shadow='RedOutlineShadow'
      borderRadius='100px'
      borderColor='textMaroonColor.400'
      borderWidth='1'
      py='6px'
      rounded='full'
      _text={{
        color: 'textGreyColor.900',
        fontSize: '14px'
      }}
      rightIcon={icon || <ChevronRightIcon size='sm' color='black' />}
    >
      {children}
    </Button>
  )
}
export default React.memo(Secondarybutton)

Secondarybutton.propTypes = {
  icon: PropTypes.element,
  children: PropTypes.any,
  props: PropTypes.any
}
