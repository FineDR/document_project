import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { initiatePayment as initiatePaymentApi, checkout, azampayCallback, webhook } from "../../api/services/paymentsApi";

// --------------------
// Types for API responses
// --------------------
interface CheckoutData {
    checkoutId?: string;
    paymentUrl?: string;
    [key: string]: any;
}

interface CheckoutResponse {
    success: boolean;
    message: string;
    data?: CheckoutData;
}

interface CallbackResponse {
    status: "received" | "failed";
}

interface PaymentResponse {
    status: string;
    message: string;
    data?: any;
}

interface WebhookResponse {
    status: string;
    message?: string;
    data?: any;
}

// --------------------
// Redux state type
// --------------------
interface PaymentState {
    loading: boolean;
    error: string | null;
    paymentData: PaymentResponse | null;
    checkoutData: CheckoutResponse | null;
    callbackData: CallbackResponse | null;
    webhookData: WebhookResponse | null;
}

// --------------------
// Initial state
// --------------------
const initialState: PaymentState = {
    loading: false,
    error: null,
    paymentData: null,
    checkoutData: null,
    callbackData: null,
    webhookData: null,
};

// --------------------
// Async thunks
// --------------------
export const initiatePayment = createAsyncThunk<
    PaymentResponse,
    Record<string, any>,
    { rejectValue: string }
>("payments/initiate", async (payload, { rejectWithValue }) => {
    try {
        const response = await initiatePaymentApi(payload);
        return response.data as PaymentResponse;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Payment initiation failed");
    }
});

export const processCheckout = createAsyncThunk<
    CheckoutResponse,
    Record<string, any>,
    { rejectValue: string }
>("payments/checkout", async (payload, { rejectWithValue }) => {
    try {
        const response = await checkout(payload);
        return response.data as CheckoutResponse;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Checkout failed");
    }
});

export const handleAzampayCallback = createAsyncThunk<
    CallbackResponse,
    Record<string, any>,
    { rejectValue: string }
>("payments/azampayCallback", async (callbackData, { rejectWithValue }) => {
    try {
        const response = await azampayCallback(callbackData);
        return response.data as CallbackResponse;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Callback processing failed");
    }
});

export const handleWebhook = createAsyncThunk<
    WebhookResponse,
    Record<string, any>,
    { rejectValue: string }
>("payments/webhook", async (webhookData, { rejectWithValue }) => {
    try {
        const response = await webhook(webhookData);
        return response.data as WebhookResponse;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Webhook handling failed");
    }
});

// --------------------
// Slice
// --------------------
const paymentSlice = createSlice({
    name: "payments",
    initialState,
    reducers: {
        resetPaymentState(state) {
            state.loading = false;
            state.error = null;
            state.paymentData = null;
            state.checkoutData = null;
            state.callbackData = null;
            state.webhookData = null;
        },
    },
    extraReducers: (builder) => {
        // initiatePayment
        builder.addCase(initiatePayment.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(initiatePayment.fulfilled, (state, action: PayloadAction<PaymentResponse>) => {
            state.loading = false;
            state.paymentData = action.payload;
        });
        builder.addCase(initiatePayment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Payment initiation failed";
        });

        // processCheckout
        builder.addCase(processCheckout.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(processCheckout.fulfilled, (state, action: PayloadAction<CheckoutResponse>) => {
            state.loading = false;
            state.checkoutData = action.payload;
        });
        builder.addCase(processCheckout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Checkout failed";
        });

        // handleAzampayCallback
        builder.addCase(handleAzampayCallback.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(handleAzampayCallback.fulfilled, (state, action: PayloadAction<CallbackResponse>) => {
            state.loading = false;
            state.callbackData = action.payload;
        });
        builder.addCase(handleAzampayCallback.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Callback failed";
        });

        // handleWebhook
        builder.addCase(handleWebhook.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(handleWebhook.fulfilled, (state, action: PayloadAction<WebhookResponse>) => {
            state.loading = false;
            state.webhookData = action.payload;
        });
        builder.addCase(handleWebhook.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Webhook failed";
        });
    },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
