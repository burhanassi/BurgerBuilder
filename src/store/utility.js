export  const  updateObject = (oldObject, updatedProperites) => {
    return {
        ...oldObject,
        ...updatedProperites
    };
};
export default updateObject;