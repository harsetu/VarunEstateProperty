// `@flavor` is a Vite/TS alias that resolves to src/flavors/<VITE_FLAVOR>,
// so only the selected website's data is bundled.
import flavor from '@flavor';
export type { Flavor, Contact, FlavorContent, DataSource } from '@/flavors/types';
export default flavor;
