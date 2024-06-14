module.exports = [
  {
    type: "doc",
    id: "whatspie/whatspie-sass-api",
  },
  {
    type: "category",
    label: "Messages",
    link: {
      type: "doc",
      id: "whatspie/messages",
    },
    items: [
      {
        type: "doc",
        id: "whatspie/get-message",
        label: "Get Message",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "whatspie/sending-text-message",
        label: "Send Text Message",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "whatspie/sending-file-message",
        label: "Send File Message",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "whatspie/sending-image-message",
        label: "Send Image Message",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "whatspie/sending-location-message",
        label: "Send Location Message",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "whatspie/sending-list-message",
        label: "Send List Message",
        className: "api-method post deprecated",
      },
      {
        type: "doc",
        id: "whatspie/sending-button-message",
        label: "Send Button Message",
        className: "api-method post deprecated",
      },
      {
        type: "doc",
        id: "whatspie/sending-template-message",
        label: "Send Template Message",
        className: "api-method post deprecated",
      },
    ],
  },
  {
    type: "category",
    label: "Devices",
    link: {
      type: "doc",
      id: "whatspie/devices",
    },
    items: [
      {
        type: "doc",
        id: "whatspie/create-device-onlyforreseller",
        label: "Create Device (only for reseller)",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "whatspie/get-device-list",
        label: "Get Device List",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "whatspie/get-qr-code",
        label: "Get QR Code",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "whatspie/get-device-information",
        label: "Get Device Information",
        className: "api-method get",
      },
    ],
  },
  {
    type: "category",
    label: "Group",
    link: {
      type: "doc",
      id: "whatspie/group",
    },
    items: [
      {
        type: "doc",
        id: "whatspie/send-message-imageto-groupby-group-id",
        label: "Send Message Image to Group by Group ID",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "whatspie/send-message-file-to-group-by-group-id",
        label: "Send Message File to Group by Group ID",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "whatspie/get-group-list",
        label: "Get Group List",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "whatspie/get-group-by-id",
        label: "Get Group By ID",
        className: "api-method get",
      },
      {
        type: "doc",
        id: "whatspie/update-group-information",
        label: "Update Group Information",
        className: "api-method put",
      },
      {
        type: "doc",
        id: "whatspie/send-messageto-groupby-group-id",
        label: "Send Message to Group by Group ID",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "whatspie/add-membertogroup",
        label: "Add Member to group",
        className: "api-method post",
      },
      {
        type: "doc",
        id: "whatspie/send-messageto-groupby-wa-group-id",
        label: "Send Message to Group by WA Group ID",
        className: "api-method post",
      },
    ],
  },
  {
    type: "category",
    label: "Contacts",
    link: {
      type: "doc",
      id: "whatspie/contacts",
    },
    items: [
      {
        type: "doc",
        id: "whatspie/checkphonenumberison-whats-app",
        label: "Check phone number is on WhatsApp",
        className: "api-method post",
      },
    ],
  },
  {
    type: "doc",
    id: "whatspie/webhook",
  },
];
