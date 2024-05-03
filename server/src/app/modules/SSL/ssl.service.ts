import axios from "axios";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../error/apiError";
import { TSSLPaymentData } from "./ssl.interface";

const initPaymentInSSL = async (paymentData: TSSLPaymentData) => {
  try {
    const data = {
      store_id: config.ssl.storeId,
      store_passwd: config.ssl.storePass,
      total_amount: paymentData.amount,
      currency: "BDT",
      tran_id: paymentData.transactionId,
      success_url: config.ssl.successUrl,
      fail_url: config.ssl.failUrl,
      cancel_url: config.ssl.cancelUrl,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "N/A",
      product_name: "N/A",
      product_category: "Service",
      product_profile: "general",
      cus_name: paymentData.name,
      cus_email: paymentData.email,
      cus_add1: paymentData.address,
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "Dhaka",
      cus_postcode: "N/A",
      cus_country: "Bangladesh",
      cus_phone: paymentData.contactNumber,
      cus_fax: "N/A",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "N/A",
      ship_country: "N/A",
    };
    const response = await axios({
      method: "POST",
      url: config.ssl.paymentApi,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Payment error ocured!"
    );
  }
};

const validatePaymentFromSSL = async (query: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.ssl.validationApi}?val_id=${query.val_id}&store_id=${config.ssl.storeId}&store_passwd=${config.ssl.storePass}&format=json`,
    });
    return response.data;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment validation payment");
  }
};

export const SSLServices = {
  initPaymentInSSL,
  validatePaymentFromSSL,
};
