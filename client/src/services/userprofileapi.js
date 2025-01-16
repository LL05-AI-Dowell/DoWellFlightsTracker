// Mock data with all required fields
const mockData = {
    data: {
        userinfo: {
            owner_id: "WS789",
            owner_name: "John Doe"
        },
        portfolio_info: {
            portfolio_name: "CUST001",
            member_type: "Premium",
            data_type: "Business"
        }
    }
};

// Function to simulate API response structure
const createMockResponse = (data) => {
    return {
        workspace_name: "Digital Workspace",
        user_id: "USR123456",
        email: "sample@gmail.com",  // Empty string as per requirement
        profile_image: "",  // Empty string as per requirement
        workspace_id: data.data.userinfo.owner_id,
        workspace_owner_name: data.data.userinfo.owner_name,
        customer_id: data.data.portfolio_info.portfolio_name,
        member_type: data.data.portfolio_info.member_type,
        data_type: data.data.portfolio_info.data_type,
        password: "hashedPassword123",
        latitude: null,  // null as per requirement
        longitude: null,  // null as per requirement
        is_active: true,
        is_notification_active: false,
        notification_duration: "one_day",
        product_url: "https://example.com/product",
        qrcode_image_url: "https://example.com/qr",
        proximity: 25
    };
};

// Mock API call function
export const selfidentification = async (token, workspaceId, documentId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate error if no token
    if (!token) {
        throw new Error("Authentication token is required");
    }

    // Return mock response
    return {
        status: 200,
        data: createMockResponse(mockData)
    };
};