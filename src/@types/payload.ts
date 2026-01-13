type insertInterface = {
    title: string,
    price: number,
    image_src?: string,
    description?: string,
    seo?: string
};

interface productInterface {
    id: number,
    title?: string,
    price?: number,
    image_src?: string,
    description?: string,
    seo?: string
};

export { insertInterface, productInterface }