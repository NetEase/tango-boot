import React, { forwardRef } from 'react';
import { Collector } from '@music163/tango-boot';
import { Input as AntInput } from 'antd';

export const Input = forwardRef((props, ref) => {
  return (
    <Collector
      {...props}
      render={({ value, setValue, ref: tangoRef }) => (
        <AntInput
          ref={mergeRefs(ref, tangoRef)}
          {...props}
          value={value}
          onChange={(e) => {
            const next = e.target.value;
            setValue(next);
          }}
        />
      )}
    />
  );
});

Input.displayName = 'Input';

function mergeRefs(...refs) {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return (instance) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    }
  };
}
