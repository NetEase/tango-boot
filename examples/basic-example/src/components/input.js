import { defineComponent } from '@music163/tango-boot';
import { Input as AntInput } from 'antd';

export const Input = defineComponent(AntInput, {
  name: 'Input',
  valuePropName: 'value',
  trigger: 'onChange',
  getValueFromEvent: (e) => e.target.value,
  registerPageState(state) {
    return {
      clear() {
        state.setValue('');
      },
    };
  },
});
