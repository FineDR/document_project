import axiosClient from "../../axiosClient"

import { TEMPLATE_DOWNLOAD } from "../../endpoints"

export const getBasicPDF=()=>axiosClient(TEMPLATE_DOWNLOAD.Basic)
export const getInterMediatePDF=()=>axiosClient(TEMPLATE_DOWNLOAD.intermediate)
export const getAdvancedPDF=()=>axiosClient(TEMPLATE_DOWNLOAD.advanced)
