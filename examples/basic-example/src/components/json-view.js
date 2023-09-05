import ReactJson from 'react-json-view';
import { view } from '@music163/tango-boot';

export const JsonView = view((props) => {
  return <ReactJson name={false} src={props.value} {...props} />;
});
