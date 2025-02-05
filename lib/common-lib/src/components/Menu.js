import React from 'react'

import { HStack, Text, VStack, Box, FlatList, Pressable } from 'native-base'
import { generatePath, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import IconByName from './IconByName'
import * as FrontEndTypo from '../components/frontend_component'
import PropTypes from 'prop-types'

const PressableNew = ({ item, children, routeDynamics, ...prop }) => {
  return item?.route ? (
    <Pressable {...prop}>
      <Link
        style={{ color: 'rgb(63, 63, 70)', textDecoration: 'none' }}
        to={
          routeDynamics
            ? generatePath(item.route, { ...{ id: item.id } })
            : item.route
        }
      >
        {children}
      </Link>
    </Pressable>
  ) : item?.onPress ? (
    <Pressable onPress={item.onPress} {...prop}>
      <Box {...prop}>{children}</Box>
    </Pressable>
  ) : (
    <Box {...prop}>{children}</Box>
  )
}
PressableNew.propTypes = {
  item: PropTypes.any,
  children: PropTypes.any,
  routeDynamics: PropTypes.any,
  prop: PropTypes.any
}

export default function Menu({
  items,
  type,
  routeDynamics,
  bg,
  _box,
  _boxMenu,
  _icon
}) {
  const chunk = (array, chunk) => {
    return [].concat.apply(
      [],
      array.map(function (elem, i) {
        return i % chunk ? [] : [array.slice(i, i + chunk)]
      })
    )
  }

  if (type === 'vertical') {
    const newItems = chunk(items, 3)
    return (
      <Box bg={bg} {..._box}>
        {newItems.map((subItems, index) => (
          <HStack key={index + 1} justifyContent='center' space={4}>
            {subItems.map((item) => (
              <PressableNew
                routeDynamics={routeDynamics}
                key={item.keyId ? item.keyId : item.id}
                item={item}
                bg='primary.500'
                rounded={'md'}
                p='2'
                minW={item?.boxMinW ? item?.boxMinW : '104px'}
              >
                <VStack
                  space='2'
                  my='2'
                  mx='1'
                  alignItems={'center'}
                  textAlign='center'
                >
                  {item.icon ? (
                    <IconByName
                      name={item.icon}
                      p='0'
                      color='white'
                      _icon={{
                        style: {
                          fontSize: '28px'
                        }
                      }}
                      {..._icon}
                    />
                  ) : null}
                  <Text
                    color='white'
                    maxW={20}
                    lineHeight={14}
                    {...item?._text}
                  >
                    {item.title}
                  </Text>
                </VStack>
              </PressableNew>
            ))}
          </HStack>
        ))}
      </Box>
    )
  } else {
    return (
      <Box bg={bg} {..._box}>
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <SubMenu {...{ item, bg, _boxMenu, routeDynamics, _icon }} />
          )}
          keyExtractor={(item, index) => (item.id ? item.id : index)}
        />
      </Box>
    )
  }
}
Menu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  type: PropTypes.oneOf(['vertical', 'horizontal']),
  routeDynamics: PropTypes.bool,
  bg: PropTypes.string,
  _box: PropTypes.any,
  _boxMenu: PropTypes.any,
  _icon: PropTypes.any
}
export const SubMenu = ({ item, routeDynamics, bg, _boxMenu, _icon }) => {
  const { t } = useTranslation()
  return (
    <Box
      borderBottomWidth='1'
      _dark={{
        borderColor: 'gray.600'
      }}
      borderLeftWidth={'5'}
      borderLeftColor={
        item.activeMenu
          ? 'primary.500'
          : item?._boxMenu?.bg
          ? item._boxMenu.bg
          : _boxMenu?.bg
          ? _boxMenu?.bg
          : bg
      }
      borderColor={'coolGray.200'}
      {..._boxMenu}
      {...item._boxMenu}
    >
      <PressableNew {...{ routeDynamics, item }}>
        <HStack space={3} justifyContent={'space-between'} width={'100%'}>
          <HStack
            space={item.leftText || item.icon ? '7' : ''}
            alignItems='center'
          >
            {item.leftText ? (
              <FrontEndTypo.H2 color='gray.700' fontWeight='500'>
                {item.leftText}
              </FrontEndTypo.H2>
            ) : item.icon ? (
              <IconByName name={item.icon} p='0' {..._icon} />
            ) : null}
            <FrontEndTypo.H2 color='gray.700' fontWeight='500'>
              {t(item.title)}
            </FrontEndTypo.H2>
          </HStack>
          <IconByName
            name={item.rightIcon ? item.rightIcon : 'ArrowRightSLineIcon'}
            p='0'
            color='textMaroonColor.400'
            {..._icon}
          />
        </HStack>
      </PressableNew>
    </Box>
  )
}

SubMenu.propTypes = {
  item: PropTypes.object,
  routeDynamics: PropTypes.bool,
  bg: PropTypes.string,
  _boxMenu: PropTypes.any,
  _icon: PropTypes.any
}
