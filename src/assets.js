import element_00 from './assets/cha_type_icon_00.png';
import element_01 from './assets/cha_type_icon_01.png';
import element_02 from './assets/cha_type_icon_02.png';
import element_03 from './assets/cha_type_icon_03.png';
import element_04 from './assets/cha_type_icon_04.png';
import element_10 from './assets/cha_type_icon_10.png';
import element_11 from './assets/cha_type_icon_11.png';
import element_12 from './assets/cha_type_icon_12.png';
import element_13 from './assets/cha_type_icon_13.png';
import element_14 from './assets/cha_type_icon_14.png';
import element_20 from './assets/cha_type_icon_20.png';
import element_21 from './assets/cha_type_icon_21.png';
import element_22 from './assets/cha_type_icon_22.png';
import element_23 from './assets/cha_type_icon_23.png';
import element_24 from './assets/cha_type_icon_24.png';

import rare_n from './assets/cha_rare_n.png';
import rare_r from './assets/cha_rare_r.png';
import rare_sr from './assets/cha_rare_sr.png';
import rare_ssr from './assets/cha_rare_ssr.png';
import rare_ur from './assets/cha_rare_ur.png';
import rare_lr from './assets/cha_rare_lr.png';

import base_00_00 from './assets/cha_base_00_00.png';
import base_00_01 from './assets/cha_base_00_01.png';
import base_00_02 from './assets/cha_base_00_02.png';
import base_00_03 from './assets/cha_base_00_03.png';
import base_00_04 from './assets/cha_base_00_04.png';
import base_00_05 from './assets/cha_base_00_05.png';
import base_01_00 from './assets/cha_base_01_00.png';
import base_01_01 from './assets/cha_base_01_01.png';
import base_01_02 from './assets/cha_base_01_02.png';
import base_01_03 from './assets/cha_base_01_03.png';
import base_01_04 from './assets/cha_base_01_04.png';
import base_01_05 from './assets/cha_base_01_05.png';
import base_02_00 from './assets/cha_base_02_00.png';
import base_02_01 from './assets/cha_base_02_01.png';
import base_02_02 from './assets/cha_base_02_02.png';
import base_02_03 from './assets/cha_base_02_03.png';
import base_02_04 from './assets/cha_base_02_04.png';
import base_02_05 from './assets/cha_base_02_05.png';
import base_03_00 from './assets/cha_base_03_00.png';
import base_03_01 from './assets/cha_base_03_01.png';
import base_03_02 from './assets/cha_base_03_02.png';
import base_03_03 from './assets/cha_base_03_03.png';
import base_03_04 from './assets/cha_base_03_04.png';
import base_03_05 from './assets/cha_base_03_05.png';
import base_04_00 from './assets/cha_base_04_00.png';
import base_04_01 from './assets/cha_base_04_01.png';
import base_04_02 from './assets/cha_base_04_02.png';
import base_04_03 from './assets/cha_base_04_03.png';
import base_04_04 from './assets/cha_base_04_04.png';
import base_04_05 from './assets/cha_base_04_05.png';

export default {

    elementIcon(e) {
        if(e == 0) return element_00;
        if(e == 1) return element_01;
        if(e == 2) return element_02;
        if(e == 3) return element_03;
        if(e == 4) return element_04;
        if(e == 10) return element_10;
        if(e == 11) return element_11;
        if(e == 12) return element_12;
        if(e == 13) return element_13;
        if(e == 14) return element_14;
        if(e == 20) return element_20;
        if(e == 21) return element_21;
        if(e == 22) return element_22;
        if(e == 23) return element_23;
        return element_24;
    },

    rarityIcon(r) {
        if(r == 1) return rare_r;
        if(r == 2) return rare_sr;
        if(r == 3) return rare_ssr;
        if(r == 4) return rare_ur;
        if(r == 5) return rare_lr;
        return rare_n;
    },

    thumbBase(e, r) {
        if(e % 10 == 0 && r == 1) return base_00_01;
        if(e % 10 == 0 && r == 2) return base_00_02;
        if(e % 10 == 0 && r == 3) return base_00_03;
        if(e % 10 == 0 && r == 4) return base_00_04;
        if(e % 10 == 0 && r == 5) return base_00_05;
        if(e % 10 == 1 && r == 0) return base_01_00;
        if(e % 10 == 1 && r == 1) return base_01_01;
        if(e % 10 == 1 && r == 2) return base_01_02;
        if(e % 10 == 1 && r == 3) return base_01_03;
        if(e % 10 == 1 && r == 4) return base_01_04;
        if(e % 10 == 1 && r == 5) return base_01_05;
        if(e % 10 == 2 && r == 0) return base_02_00;
        if(e % 10 == 2 && r == 1) return base_02_01;
        if(e % 10 == 2 && r == 2) return base_02_02;
        if(e % 10 == 2 && r == 3) return base_02_03;
        if(e % 10 == 2 && r == 4) return base_02_04;
        if(e % 10 == 2 && r == 5) return base_02_05;
        if(e % 10 == 3 && r == 0) return base_03_00;
        if(e % 10 == 3 && r == 1) return base_03_01;
        if(e % 10 == 3 && r == 2) return base_03_02;
        if(e % 10 == 3 && r == 3) return base_03_03;
        if(e % 10 == 3 && r == 4) return base_03_04;
        if(e % 10 == 3 && r == 5) return base_03_05;
        if(e % 10 == 4 && r == 0) return base_04_00;
        if(e % 10 == 4 && r == 1) return base_04_01;
        if(e % 10 == 4 && r == 2) return base_04_02;
        if(e % 10 == 4 && r == 3) return base_04_03;
        if(e % 10 == 4 && r == 4) return base_04_04;
        if(e % 10 == 4 && r == 5) return base_04_05;

        return base_00_00;
    }

}