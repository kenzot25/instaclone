// import React, { useState } from "react";
// import { client } from "../client";
// import { v4 as uuidv4 } from "uuid";
// const imgURL = [
//   "https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg",
//   "https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg",
//   "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg",
//   "https://images.pexels.com/photos/1643409/pexels-photo-1643409.jpeg",
//   "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg",
//   "https://images.pexels.com/photos/325044/pexels-photo-325044.jpeg",
//   "https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg",
//   "https://images.pexels.com/photos/2049422/pexels-photo-2049422.jpeg",
//   "https://images.pexels.com/photos/1485894/pexels-photo-1485894.jpeg",
//   "https://images.pexels.com/photos/592077/pexels-photo-592077.jpeg",
//   "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg",
//   "https://images.pexels.com/photos/1743366/pexels-photo-1743366.jpeg",
//   "https://images.pexels.com/photos/1518500/pexels-photo-1518500.jpeg",
//   "https://images.pexels.com/photos/1477459/pexels-photo-1477459.jpeg",
//   "https://images.pexels.com/photos/4622893/pexels-photo-4622893.jpeg",
//   "https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg",
//   "https://images.pexels.com/photos/2724664/pexels-photo-2724664.jpeg",
//   "https://images.pexels.com/photos/2681741/pexels-photo-2681741.jpeg",
//   "https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg",
//   "https://images.pexels.com/photos/1480807/pexels-photo-1480807.jpeg",
//   "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg",
//   "https://images.pexels.com/photos/2162442/pexels-photo-2162442.jpeg",
//   "https://images.pexels.com/photos/3681159/pexels-photo-3681159.jpeg",
//   "https://images.pexels.com/photos/1213447/pexels-photo-1213447.jpeg",
//   "https://images.pexels.com/photos/2514035/pexels-photo-2514035.jpeg",
//   "https://images.pexels.com/photos/2776479/pexels-photo-2776479.jpeg",
//   "https://images.pexels.com/photos/2171277/pexels-photo-2171277.jpeg",
//   "https://images.pexels.com/photos/4436700/pexels-photo-4436700.jpeg",
//   "https://images.pexels.com/photos/1662298/pexels-photo-1662298.jpeg",
//   "https://images.pexels.com/photos/2917355/pexels-photo-2917355.jpeg",
//   "https://images.pexels.com/photos/1632788/pexels-photo-1632788.jpeg",
//   "https://images.pexels.com/photos/3048634/pexels-photo-3048634.jpeg",
//   "https://images.pexels.com/photos/4236830/pexels-photo-4236830.jpeg",
//   "https://images.pexels.com/photos/4236828/pexels-photo-4236828.jpeg",
//   "https://images.pexels.com/photos/4843441/pexels-photo-4843441.jpeg",
//   "https://images.pexels.com/photos/5400806/pexels-photo-5400806.jpeg",
//   "https://images.pexels.com/photos/7693183/pexels-photo-7693183.jpeg",
//   "https://images.pexels.com/photos/3787029/pexels-photo-3787029.jpeg",
//   "https://images.pexels.com/photos/1673973/pexels-photo-1673973.jpeg",
//   "https://images.pexels.com/photos/3764310/pexels-photo-3764310.jpeg",
//   "https://images.pexels.com/photos/7693181/pexels-photo-7693181.jpeg",
//   "https://images.pexels.com/photos/7693167/pexels-photo-7693167.jpeg",
//   "https://images.pexels.com/photos/5544913/pexels-photo-5544913.jpeg",
//   "https://images.pexels.com/photos/5555481/pexels-photo-5555481.jpeg",
//   "https://images.pexels.com/photos/4236826/pexels-photo-4236826.jpeg",
//   "https://images.pexels.com/photos/5542345/pexels-photo-5542345.jpeg",
//   "https://images.pexels.com/photos/4236824/pexels-photo-4236824.jpeg",
//   "https://images.pexels.com/photos/5541433/pexels-photo-5541433.jpeg",
//   "https://images.pexels.com/photos/10499694/pexels-photo-10499694.jpeg",
//   "https://images.pexels.com/photos/5540454/pexels-photo-5540454.jpeg",
//   "https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg",
//   "https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg",
//   "https://images.pexels.com/photos/4236827/pexels-photo-4236827.jpeg",
//   "https://images.pexels.com/photos/10499285/pexels-photo-10499285.jpeg",
//   "https://images.pexels.com/photos/10499270/pexels-photo-10499270.jpeg",
//   "https://images.pexels.com/photos/9955404/pexels-photo-9955404.jpeg",
//   "https://images.pexels.com/photos/4236825/pexels-photo-4236825.jpeg",
//   "https://images.pexels.com/photos/10499275/pexels-photo-10499275.jpeg",
//   "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg",
//   "https://images.pexels.com/photos/4665189/pexels-photo-4665189.jpeg",
//   "https://images.pexels.com/photos/7396060/pexels-photo-7396060.jpeg",
//   "https://images.pexels.com/photos/10078138/pexels-photo-10078138.jpeg",
//   "https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg",
//   "https://images.pexels.com/photos/1809644/pexels-photo-1809644.jpeg",
//   "https://images.pexels.com/photos/10067478/pexels-photo-10067478.jpeg",
//   "https://images.pexels.com/photos/10867331/pexels-photo-10867331.jpeg",
//   "https://images.pexels.com/photos/10076774/pexels-photo-10076774.jpeg",
//   "https://images.pexels.com/photos/10068270/pexels-photo-10068270.jpeg",
//   "https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg",
//   "https://images.pexels.com/photos/1456291/pexels-photo-1456291.jpeg",
//   "https://images.pexels.com/photos/10850900/pexels-photo-10850900.jpeg",
//   "https://images.pexels.com/photos/4403924/pexels-photo-4403924.jpeg",
//   "https://images.pexels.com/photos/1416900/pexels-photo-1416900.jpeg",
//   "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg",
//   "https://images.pexels.com/photos/6070190/pexels-photo-6070190.jpeg",
//   "https://images.pexels.com/photos/8531679/pexels-photo-8531679.jpeg",
//   "https://images.pexels.com/photos/8530187/pexels-photo-8530187.jpeg",
//   "https://images.pexels.com/photos/8530490/pexels-photo-8530490.jpeg",
//   "https://images.pexels.com/photos/8530988/pexels-photo-8530988.jpeg",
//   "https://images.pexels.com/photos/8104858/pexels-photo-8104858.jpeg",
//   "https://images.pexels.com/photos/8531275/pexels-photo-8531275.jpeg",
//   "https://images.pexels.com/photos/8531229/pexels-photo-8531229.jpeg",
//   "https://images.pexels.com/photos/8106739/pexels-photo-8106739.jpeg",
//   "https://images.pexels.com/photos/8105801/pexels-photo-8105801.jpeg",
//   "https://images.pexels.com/photos/8648815/pexels-photo-8648815.jpeg",
//   "https://images.pexels.com/photos/8103914/pexels-photo-8103914.jpeg",
//   "https://images.pexels.com/photos/8530926/pexels-photo-8530926.jpeg",
//   "https://images.pexels.com/photos/4503505/pexels-photo-4503505.jpeg",
//   "https://images.pexels.com/photos/8531227/pexels-photo-8531227.jpeg",
//   "https://images.pexels.com/photos/7613829/pexels-photo-7613829.jpeg",
//   "https://images.pexels.com/photos/8531694/pexels-photo-8531694.jpeg",
//   "https://images.pexels.com/photos/8530192/pexels-photo-8530192.jpeg",
//   "https://images.pexels.com/photos/8531230/pexels-photo-8531230.jpeg",
//   "https://images.pexels.com/photos/8530882/pexels-photo-8530882.jpeg",
//   "https://images.pexels.com/photos/8102529/pexels-photo-8102529.jpeg",
//   "https://images.pexels.com/photos/8530221/pexels-photo-8530221.jpeg",
//   "https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg",
//   "https://images.pexels.com/photos/3791466/pexels-photo-3791466.jpeg",
//   "https://images.pexels.com/photos/853199/pexels-photo-853199.jpeg",
//   "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg",
//   "https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg",
//   "https://images.pexels.com/photos/1526713/pexels-photo-1526713.jpeg",
//   "https://images.pexels.com/photos/3680912/pexels-photo-3680912.jpeg",
//   "https://images.pexels.com/photos/2090645/pexels-photo-2090645.jpeg",
//   "https://images.pexels.com/photos/1435075/pexels-photo-1435075.jpeg",
//   "https://images.pexels.com/photos/1229042/pexels-photo-1229042.jpeg",
//   "https://images.pexels.com/photos/1544376/pexels-photo-1544376.jpeg",
//   "https://images.pexels.com/photos/4014919/pexels-photo-4014919.jpeg",
//   "https://images.pexels.com/photos/1738622/pexels-photo-1738622.jpeg",
//   "https://images.pexels.com/photos/1595437/pexels-photo-1595437.jpeg",
//   "https://images.pexels.com/photos/4321501/pexels-photo-4321501.jpeg",
//   "https://images.pexels.com/photos/3689269/pexels-photo-3689269.jpeg",
//   "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg",
//   "https://images.pexels.com/photos/3784221/pexels-photo-3784221.jpeg",
//   "https://images.pexels.com/photos/1271620/pexels-photo-1271620.jpeg",
//   "https://images.pexels.com/photos/4328298/pexels-photo-4328298.jpeg",
//   "https://images.pexels.com/photos/4738081/pexels-photo-4738081.jpeg",
//   "https://images.pexels.com/photos/1632780/pexels-photo-1632780.jpeg",
//   "https://images.pexels.com/photos/5008377/pexels-photo-5008377.jpeg",
//   "https://images.pexels.com/photos/1668246/pexels-photo-1668246.jpeg",
//   "https://images.pexels.com/photos/2670898/pexels-photo-2670898.jpeg",
//   "https://images.pexels.com/photos/2781760/pexels-photo-2781760.jpeg",
//   "https://images.pexels.com/photos/3569191/pexels-photo-3569191.jpeg",
//   "https://images.pexels.com/photos/4597117/pexels-photo-4597117.jpeg",
//   "https://images.pexels.com/photos/7694004/pexels-photo-7694004.jpeg",
//   "https://images.pexels.com/photos/5199173/pexels-photo-5199173.jpeg",
//   "https://images.pexels.com/photos/1707213/pexels-photo-1707213.jpeg",
//   "https://images.pexels.com/photos/3209168/pexels-photo-3209168.jpeg",
//   "https://images.pexels.com/photos/7693176/pexels-photo-7693176.jpeg",
//   "https://images.pexels.com/photos/10558725/pexels-photo-10558725.jpeg",
//   "https://images.pexels.com/photos/4236831/pexels-photo-4236831.jpeg",
//   "https://images.pexels.com/photos/3784648/pexels-photo-3784648.jpeg",
//   "https://images.pexels.com/photos/7705878/pexels-photo-7705878.jpeg",
//   "https://images.pexels.com/photos/9955403/pexels-photo-9955403.jpeg",
//   "https://images.pexels.com/photos/5542344/pexels-photo-5542344.jpeg",
//   "https://images.pexels.com/photos/4236823/pexels-photo-4236823.jpeg",
//   "https://images.pexels.com/photos/10182592/pexels-photo-10182592.jpeg",
//   "https://images.pexels.com/photos/10499279/pexels-photo-10499279.jpeg",
//   "https://images.pexels.com/photos/5540312/pexels-photo-5540312.jpeg",
//   "https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg",
//   "https://images.pexels.com/photos/10499284/pexels-photo-10499284.jpeg",
//   "https://images.pexels.com/photos/6513993/pexels-photo-6513993.jpeg",
//   "https://images.pexels.com/photos/10558674/pexels-photo-10558674.jpeg",
//   "https://images.pexels.com/photos/9955406/pexels-photo-9955406.jpeg",
//   "https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg",
//   "https://images.pexels.com/photos/10499277/pexels-photo-10499277.jpeg",
//   "https://images.pexels.com/photos/1645668/pexels-photo-1645668.jpeg",
//   "https://images.pexels.com/photos/2734421/pexels-photo-2734421.jpeg",
//   "https://images.pexels.com/photos/10499503/pexels-photo-10499503.jpeg",
//   "https://images.pexels.com/photos/10499278/pexels-photo-10499278.jpeg",
//   "https://images.pexels.com/photos/10979085/pexels-photo-10979085.jpeg",
//   "https://images.pexels.com/photos/5633616/pexels-photo-5633616.jpeg",
//   "https://images.pexels.com/photos/4665180/pexels-photo-4665180.jpeg",
//   "https://images.pexels.com/photos/2749481/pexels-photo-2749481.jpeg",
//   "https://images.pexels.com/photos/4328961/pexels-photo-4328961.jpeg",
//   "https://images.pexels.com/photos/2468773/pexels-photo-2468773.jpeg",
//   "https://images.pexels.com/photos/10068643/pexels-photo-10068643.jpeg",
//   "https://images.pexels.com/photos/1534057/pexels-photo-1534057.jpeg",
//   "https://images.pexels.com/photos/730981/pexels-photo-730981.jpeg",
//   "https://images.pexels.com/photos/1671324/pexels-photo-1671324.jpeg",
//   "https://images.pexels.com/photos/1270184/pexels-photo-1270184.jpeg",
//   "https://images.pexels.com/photos/10012492/pexels-photo-10012492.jpeg",
//   "https://images.pexels.com/photos/3592627/pexels-photo-3592627.jpeg",
//   "https://images.pexels.com/photos/8531681/pexels-photo-8531681.jpeg",
//   "https://images.pexels.com/photos/8530346/pexels-photo-8530346.jpeg",
//   "https://images.pexels.com/photos/1172675/pexels-photo-1172675.jpeg",
//   "https://images.pexels.com/photos/8013817/pexels-photo-8013817.jpeg",
//   "https://images.pexels.com/photos/8531680/pexels-photo-8531680.jpeg",
//   "https://images.pexels.com/photos/1496372/pexels-photo-1496372.jpeg",
//   "https://images.pexels.com/photos/5633983/pexels-photo-5633983.jpeg",
//   "https://images.pexels.com/photos/8531373/pexels-photo-8531373.jpeg",
//   "https://images.pexels.com/photos/10458835/pexels-photo-10458835.jpeg",
//   "https://images.pexels.com/photos/3222686/pexels-photo-3222686.jpeg",
//   "https://images.pexels.com/photos/8531012/pexels-photo-8531012.jpeg",
//   "https://images.pexels.com/photos/7613830/pexels-photo-7613830.jpeg",
//   "https://images.pexels.com/photos/5008376/pexels-photo-5008376.jpeg",
//   "https://images.pexels.com/photos/8530924/pexels-photo-8530924.jpeg",
//   "https://images.pexels.com/photos/8105805/pexels-photo-8105805.jpeg",
//   "https://images.pexels.com/photos/4884134/pexels-photo-4884134.jpeg",
//   "https://images.pexels.com/photos/4884117/pexels-photo-4884117.jpeg",
//   "https://images.pexels.com/photos/8104851/pexels-photo-8104851.jpeg",
//   "https://images.pexels.com/photos/2627063/pexels-photo-2627063.jpeg",
//   "https://images.pexels.com/photos/1457812/pexels-photo-1457812.jpeg",
//   "https://images.pexels.com/photos/8530478/pexels-photo-8530478.jpeg",
//   "https://images.pexels.com/photos/8530415/pexels-photo-8530415.jpeg",
//   "https://images.pexels.com/photos/8531237/pexels-photo-8531237.jpeg",
//   "https://images.pexels.com/photos/8529646/pexels-photo-8529646.jpeg",
//   "https://images.pexels.com/photos/10146849/pexels-photo-10146849.jpeg",
//   "https://images.pexels.com/photos/8530928/pexels-photo-8530928.jpeg",
//   "https://images.pexels.com/photos/8529722/pexels-photo-8529722.jpeg",
//   "https://images.pexels.com/photos/7391720/pexels-photo-7391720.jpeg",
//   "https://images.pexels.com/photos/3341710/pexels-photo-3341710.jpeg",
//   "",
// ];
// const postsID = [
//   "3937b909-691d-4bc0-9700-06f1f6948900",
//   "47395dfb-cb14-4c9f-a9ac-1f45fe96a95b",
//   "a2655ed5-bff7-4ed3-8ad3-57cf328dcdc4",
//   "a3615b0e-2e5c-431d-b400-ed36a5b49205",
//   "97121427-63e0-4275-af5b-9456a01f2f21",
//   "a74ebfa2-9605-4431-a034-703750f8f127",
//   "8a3b80f2-08cc-4459-a5e6-26e5565b981d",
//   "76518a15-1c2f-49d7-b9a4-90224d8f660e",
//   "ef5757a7-6873-4351-aa74-40c96e3d7ab2",
//   "a432787d-db7a-4487-8a25-f4cf90af4f4c",
//   "1f903f48-baa3-4496-857c-c15c131b30be",
//   "94f57706-b684-482e-a077-458aab9d2ce7",
//   "3f0877db-a5ce-4b18-a459-06f431adbc06",
//   "dea050fe-653f-4950-ab14-ca4b8b66674b",
//   "b8d913df-9740-4a6e-aa44-0f32d601a0a1",
//   "0a8c83e9-9b63-4f27-abd8-3833ed9575d6",
//   "9aad4e04-0850-4bdc-a1db-63dc6452b205",
//   "7cfaf51d-a64a-45e2-9c8d-9b10c4080b84",
//   "395de102-7792-43dd-8825-5d3f47d74b17",
//   "2831adfb-3f1b-438b-804e-e085f73da289",
//   "86f97395-ee6f-4d95-aef7-b7fcb2507439",
//   "faa3ca26-d936-4eb6-8f6d-8c3b1889e0d2",
//   "87130ff0-8847-4b5f-ac0b-8451c0f6f5cf",
//   "6e5d6f08-85c3-40dd-8573-beed9e25c1d9",
//   "ca23c2a7-45b7-4b22-878c-1662ea3972e2",
//   "60b8209b-367d-4e33-b465-34c786ce9e87",
//   "0bba9e77-2d08-43be-856b-81d886c548b9",
//   "00ed4273-f4e4-46e2-bf03-33fb70ca69d3",
//   "3024d661-72aa-47db-b1e4-2127323e5c5e",
//   "69bc158d-e882-4a3b-9fd9-a44fbe8db94b",
//   "599c6597-380f-4929-808c-804a84b12f59",
//   "af61e821-2947-41b8-9d05-58d8b8987c24",
//   "7ed3d0d8-c600-40c5-8344-1e0afdca479d",
//   "30a509fd-6769-44a5-80b5-d5ee508ac3c2",
//   "b97b7a2f-4bde-4337-923e-c3e66310d9d9",
//   "4ce0bd1a-06ca-49f7-8058-6b5249effdbc",
//   "74189662-7252-49aa-8b1d-6ddcf7a38174",
//   "42e700ce-45a8-4546-b6c4-ada2c081f2e6",
//   "af8f31ca-e01e-4fdc-86aa-e6ea7c349077",
//   "19164ee6-f040-4de9-8435-7b084d39a517",
//   "61cfaad2-b985-48e9-9fb2-8f3fb3a08fdb",
//   "0e32bc5a-1450-4c9c-93b0-9f9ed0f80841",
//   "3b6ec92b-9003-4308-87f7-a267c62ab39d",
//   "604d8dd1-2b05-4d37-97e8-b0342a33eea5",
//   "e4217e22-9ce8-4211-ad4f-d1bebc32e36a",
//   "50efcfad-5c7f-45a1-aaf8-9019a6975a52",
//   "c305aa03-f0c7-4632-abab-07d547dcd745",
//   "e9893035-35e4-469f-81ae-7fae4cfb131d",
//   "291e3c2e-0560-424e-8deb-6315866e9cf4",
//   "f77e35df-a9d1-4ce4-a1f2-8884ee4b50e5",
//   "94448867-8fad-4e29-9507-54ce2a9a03c5",
//   "734840c4-f185-4794-ac1b-303caf5d03eb",
//   "67213b84-7c50-4dc8-a6b3-9a93bed2e543",
//   "187d788e-23d2-4d7a-802c-4f0000d61339",
//   "8e56d6a7-cf1b-4381-a66e-8950c7fa3c1a",
//   "b05136fa-b7c4-4097-bb9b-bc6383ab918e",
//   "41f8b47f-a73f-484e-a698-a8e71f909b5c",
//   "634f8117-72bc-461e-b433-2a2377f09091",
//   "da65fbd4-c626-4df5-8430-913bff4f6581",
//   "11318b32-8e8d-45f5-8111-aec35a5f89ed",
//   "98721d81-0001-4ccd-92ae-479a2c5d6904",
//   "46be4b81-4d96-4a22-8206-9e90ede618b3",
//   "a39a4e4d-8760-4ac4-9a71-55b83651176e",
//   "1b6281e1-79e5-48ea-889a-bcf412b6193e",
//   "7a892a46-b5cd-4518-81fb-77749c6805b2",
//   "c9a1b426-09a9-49b0-94ee-592c5d0959f4",
//   "ed2a6c41-cba9-4c3e-b149-0619295fffe1",
//   "e3571871-630a-41a5-85f2-59bdd44897a0",
//   "2317a80e-8f6b-472e-b66c-9f4b300415ab",
// ];

// const FetchData = () => {
//   const [imageAsset, setImageAsset] = useState([]);
//   const [indexIMG, setIndexIMG] = useState(0);
//   const [indexUser, setIndexUser] = useState(0);
//   let url =
//     "https://images.unsplash.com/photo-1640622656891-04960a7aa678?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=386&q=80";
//   const toDataURL = (url) =>
//     fetch(url)
//       .then((response) => response.blob())
//       .then(
//         (blob) =>
//           new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result);
//             reader.onerror = reject;
//             reader.readAsDataURL(blob);
//           })
//       );
//   function dataURLtoFile(dataurl, filename) {
//     var arr = dataurl.split(","),
//       mime = arr[0].match(/:(.*?);/)[1],
//       bstr = atob(arr[1]),
//       n = bstr.length,
//       u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new File([u8arr], filename, { type: mime });
//   }
//   const getFile = (url, filename) => {
//     toDataURL(url).then((dataUrl) => {
//       //   console.log("Here is Base64 Url", dataUrl);
//       var fileData = dataURLtoFile(dataUrl, filename);
//       console.log("Here is JavaScript File Object", fileData);
//       const { type, name } = fileData;
//       client.assets
//         .upload("image", fileData, {
//           contentType: type,
//           filename: name,
//         })
//         .then((doc) => {
//           setImageAsset((prev) => [...prev, doc]);

//           //   imageAsset = [...imageAsset, doc];
//         });
//     });
//   };
//   const pushIMG = (postID) => {
//     // "0e3e44ef-12d5-4298-91ca-460628f29b99"
//     const images = [];
//     console.log(imageAsset);
//     imageAsset.map((image) => {
//       console.log(image);
//       return images.push({
//         _type: "image",
//         _key: uuidv4(),
//         asset: {
//           _type: "reference",
//           _ref: image._id,
//         },
//       });
//     });
//     client
//       .patch(postID)
//       .setIfMissing({ images: [] })
//       .insert("after", "images[-1]", images)
//       .commit();
//   };

//   ////

//   const getRandFile = () => {
//     console.log(imageAsset);
//     for (let i = 0; i < Math.floor(Math.random() * 3 + 1); i++) {
//       getFile(imgURL[indexIMG], "postimg" + [i]);
//       setIndexIMG((prev) => prev + 1);
//     }
//   };
//   const pushAllFileAndDelete = () => {
//     console.log("Index user: " + indexUser);
//     console.log(postsID[indexUser]);
//     pushIMG(postsID[indexUser]);
//     setImageAsset([]);
//     setIndexUser((prev) => prev + 1);
//   };
//   const auto = () => {
//     for (let i = 0; i < postsID.length; i++) {
//       setTimeout(() => {
//         getRandFile();
//         setTimeout(() => {
//           pushAllFileAndDelete();
//         }, 2000);
//       }, 3000);
//     }
//   };
//   ///
//   return (
//     <>
//       <div
//         onClick={() => {
//           getRandFile();
//         }}
//       >
//         Fucking data
//       </div>
//       <div
//         onClick={() => {
//           pushAllFileAndDelete();
//         }}
//       >
//         Post img
//       </div>
//       <div
//         onClick={() => {
//           auto();
//         }}
//       >
//         AUTO
//       </div>
//     </>
//   );
// };

// export default FetchData;
