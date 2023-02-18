
// export default async function loadLabeledImages() {
// return Promise.all(
//     users.map(async (label) => {
//     const descriptions = [];
//     for (let i = 1; i <= 2; i++) {
//         setTimeout(async () => {
//         console.log(label.id, i);
//         const img = await faceapi.fetchImage(
//             `https://guestgo.herokuapp.com/user/picture/${label.id.toString()}/${i}`
//         );
//         const detections = await faceapi
//             .detectSingleFace(img)
//             .withFaceLandmarks()
//             .withFaceDescriptor();
//         descriptions.push(detections.descriptor);
//         }, 100);
//     }

//     return new faceapi.LabeledFaceDescriptors(label.id, descriptions);
//     })
// );
// }

export default async function loadLabeledImages2() {
    const lab = users.map(async (label) => {
      const descriptions = [];
      console.log(label.id, 1);
      const img = await faceapi.fetchImage(
        `https://guestgo.herokuapp.com/user/picture/${label.id.toString()}/${1}`
      );
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      descriptions.push(detections.descriptor);

      return new faceapi.LabeledFaceDescriptors(label.id, descriptions);
    });
    console.log(lab);
    return Promise.all(lab);
}