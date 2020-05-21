import { axiosMethods } from '../utils/axios';
import genAPI from './genAPI';

export default (api: string) => genAPI(api, axiosMethods);
