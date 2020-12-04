/*
  Copyright Jim Carty © 2020

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import { instantiateStreaming } from 'assemblyscript/lib/loader';

export default instantiateStreaming(
  fetch( `${process.env.PUBLIC_URL}/wasm/Emulator.wasm` )
).then( emu => {
  return emu.exports;
});