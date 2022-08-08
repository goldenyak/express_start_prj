export const errorsBundle = (errors: object[]) => {
    const resultErrors = errors.map((el:any) => {
        return {message: el.msg.toString(), field: el.param.toString()}
    })

    if (resultErrors.length > 0) {
        return resultErrors
    } else return undefined

}