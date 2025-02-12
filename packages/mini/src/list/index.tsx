import { memo, type ReactNode } from 'react';
import { View } from '@tarojs/components';
import { AtList, AtListItem } from 'taro-ui';
import './index.scss';
import type { AtListProps } from 'taro-ui/types/list';
import classNames from 'classnames';
import { Text } from '../text';
import { isNumber } from 'lodash-es';
import SvgCopy from '../assets/copy.svg';
import Taro from '@tarojs/taro';
import { Svg } from '../svg';

const ListTitle = memo<{ title: string; right?: ReactNode }>((props) => {
  return (
    <View className="mini-list-title flex items-end justify-between p-1 px-2 pt-2">
      <Text className="text-desc">{props.title}</Text>
      <View>{props.right}</View>
    </View>
  );
});

interface ListProps extends AtListProps {
  title?: string;
  size?: 'small';
  responseWidth?: boolean;
  extraTextDefaultColor?: boolean;
}
const List = (props) => {
  return (
    <View>
      {props.title && <ListTitle title={props.title} />}
      <View
        className={classNames('mini-list', {
          'mini-list-response-width': props.responseWidth,
          'mini-list-extra-text-default-color': props.extraTextDefaultColor,
          'mini-list-size-small': props.size === 'small',
        })}
      >
        <AtList {...props} />
      </View>
    </View>
  );
};

List.Item = AtListItem;
List.Title = ListTitle;

interface ListDescriptionProps extends Pick<ListProps, 'size' | 'title'> {
  items: {
    label: string | ReactNode;
    value?: string | number | ReactNode;
    desc?: string;
    onClick?: (e: any) => void;
    /** 复制值，为 true 时复制 value，为 string时复制 copy */
    copy?: string | boolean;
  }[];
}

const ListDescription = (props: ListDescriptionProps) => {
  return (
    <List title={props.title} size={props.size} responseWidth extraTextDefaultColor>
      {props.items.map((item, index) => {
        let extraText = item.value;

        if (isNumber(item.value)) {
          extraText = item.value!.toString();
        }

        const handleClick = (e: any) => {
          if (item.copy) {
            Taro.setClipboardData({
              data: item.copy === true ? item.value!.toString() : item.copy,
            });
          }
          item.onClick?.(e);
        };

        if (item.copy) {
          extraText = (
            <View className="flex items-center gap-1">
              {extraText}
              <Svg icon={SvgCopy} />
            </View>
          );
        }

        return (
          <List.Item
            key={index}
            title={item.label as any}
            extraText={extraText as any}
            note={item.desc}
            onClick={handleClick}
          />
        );
      })}
    </List>
  );
};

List.Description = ListDescription;

export { List };
