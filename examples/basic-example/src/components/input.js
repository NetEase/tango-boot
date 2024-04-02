import { defineComponent } from '@music163/tango-boot';
import { Input as AntInput } from 'antd';

export const Input = defineComponent(AntInput, {
  name: 'Input',
  registerState: {
    getInitStates({ setPageState }, props) {
      return {
        value: props.defaultValue ?? '',
        clear() {
          setPageState({ value: '' });
        },
        setValue(nextValue) {
          setPageState({ value: nextValue });
        },
      };
    },

    getTriggerProps({ setPageState, getPageState }) {
      return {
        value: getPageState()?.value,
        onChange(e) {
          setPageState({ value: e.target.value });
        },
      };
    },
  },
});
