const axios = require("axios");

async function addTestStationsFields() {
  const directusUrl = "https://adminwayfinder.bhugolapps.com";
  const token = "yuwhSp0bgTKasJwu6BSBLveGLpgerRc8";

  // Check if token is provided
  if (!token) {
    console.error("Error: Please provide a valid admin token.");
    return;
  }

  const fields = [
    {
      collection: "Test_Stations",
      field: "id",
      type: "integer",
      schema: {
        name: "id",
        table: "Test_Stations",
        schema: "public",
        data_type: "integer",
        is_nullable: false,
        default_value: "nextval('\"Test_Stations_id_seq\"'::regclass)",
        is_unique: true,
        is_primary_key: true,
        has_auto_increment: true,
      },
      meta: {
        collection: "Test_Stations",
        field: "id",
        interface: "input",
        readonly: true,
        hidden: true,
        sort: 1,
        width: "full",
        required: false,
      },
    },
    {
      collection: "Test_Stations",
      field: "status",
      type: "string",
      schema: {
        name: "status",
        table: "Test_Stations",
        schema: "public",
        data_type: "character varying",
        is_nullable: true,
        default_value: "published",
        max_length: 255,
      },
      meta: {
        collection: "Test_Stations",
        field: "status",
        interface: "select-dropdown",
        options: {
          choices: [
            {
              text: "Published",
              value: "published",
              color: "var(--theme--primary)",
            },
            {
              text: "Draft",
              value: "draft",
              color: "var(--theme--foreground)",
            },
            {
              text: "Archived",
              value: "archived",
              color: "var(--theme--warning)",
            },
          ],
        },
        display: "labels",
        display_options: {
          showAsDot: true,
          choices: [
            {
              text: "Published",
              value: "published",
              color: "var(--theme--primary)",
              foreground: "var(--theme--primary)",
              background: "var(--theme--primary-background)",
            },
            {
              text: "Draft",
              value: "draft",
              color: "var(--theme--foreground)",
              foreground: "var(--theme--foreground)",
              background: "var(--theme--background-normal)",
            },
            {
              text: "Archived",
              value: "archived",
              color: "var(--theme--warning)",
              foreground: "var(--theme--warning)",
              background: "var(--theme--warning-background)",
            },
          ],
        },
        readonly: false,
        hidden: false,
        sort: 2,
        width: "full",
        required: false,
      },
    },
    {
      collection: "Test_Stations",
      field: "sort",
      type: "integer",
      schema: {
        name: "sort",
        table: "Test_Stations",
        schema: "public",
        data_type: "integer",
        is_nullable: true,
      },
      meta: {
        collection: "Test_Stations",
        field: "sort",
        interface: "input",
        readonly: false,
        hidden: true,
        sort: 3,
        width: "full",
        required: false,
      },
    },
    {
      collection: "Test_Stations",
      field: "user_created",
      type: "uuid",
      schema: {
        name: "user_created",
        table: "Test_Stations",
        schema: "public",
        data_type: "uuid",
        is_nullable: true,
        foreign_key_schema: "public",
        foreign_key_table: "directus_users",
        foreign_key_column: "id",
      },
      meta: {
        collection: "Test_Stations",
        field: "user_created",
        special: ["user-created"],
        interface: "select-dropdown-m2o",
        options: {
          template: "{{avatar.$thumbnail}} {{first_name}} {{last_name}}",
        },
        display: "user",
        readonly: true,
        hidden: true,
        sort: 4,
        width: "half",
        required: false,
      },
    },
    {
      collection: "Test_Stations",
      field: "date_created",
      type: "timestamp",
      schema: {
        name: "date_created",
        table: "Test_Stations",
        schema: "public",
        data_type: "timestamp with time zone",
        is_nullable: true,
      },
      meta: {
        collection: "Test_Stations",
        field: "date_created",
        special: ["date-created"],
        interface: "datetime",
        display: "datetime",
        display_options: {
          relative: true,
        },
        readonly: true,
        hidden: true,
        sort: 5,
        width: "half",
        required: false,
      },
    },
    {
      collection: "Test_Stations",
      field: "user_updated",
      type: "uuid",
      schema: {
        name: "user_updated",
        table: "Test_Stations",
        schema: "public",
        data_type: "uuid",
        is_nullable: true,
        foreign_key_schema: "public",
        foreign_key_table: "directus_users",
        foreign_key_column: "id",
      },
      meta: {
        collection: "Test_Stations",
        field: "user_updated",
        special: ["user-updated"],
        interface: "select-dropdown-m2o",
        options: {
          template: "{{avatar.$thumbnail}} {{first_name}} {{last_name}}",
        },
        display: "user",
        readonly: true,
        hidden: true,
        sort: 6,
        width: "half",
        required: false,
      },
    },
    {
      collection: "Test_Stations",
      field: "date_updated",
      type: "timestamp",
      schema: {
        name: "date_updated",
        table: "Test_Stations",
        schema: "public",
        data_type: "timestamp with time zone",
        is_nullable: true,
      },
      meta: {
        collection: "Test_Stations",
        field: "date_updated",
        special: ["date-updated"],
        interface: "datetime",
        display: "datetime",
        display_options: {
          relative: true,
        },
        readonly: true,
        hidden: true,
        sort: 7,
        width: "half",
        required: false,
      },
    },
    {
      collection: "Test_Stations",
      field: "Station_Code",
      type: "string",
      schema: {
        name: "Station_Code",
        table: "Test_Stations",
        schema: "public",
        data_type: "character varying",
        is_nullable: true,
        max_length: 255,
      },
      meta: {
        collection: "Test_Stations",
        field: "Station_Code",
        interface: "input",
        readonly: false,
        hidden: false,
        sort: 8,
        width: "full",
        required: true,
      },
    },
    {
      collection: "Test_Stations",
      field: "Station_Name",
      type: "string",
      schema: {
        name: "Station_Name",
        table: "Test_Stations",
        schema: "public",
        data_type: "character varying",
        is_nullable: true,
        max_length: 255,
      },
      meta: {
        collection: "Test_Stations",
        field: "Station_Name",
        interface: "input",
        readonly: false,
        hidden: false,
        sort: 9,
        width: "full",
        required: true,
      },
    },
    {
      collection: "Test_Stations",
      field: "Station_Commercial_Name",
      type: "string",
      schema: {
        name: "Station_Commercial_Name",
        table: "Test_Stations",
        schema: "public",
        data_type: "character varying",
        is_nullable: true,
        max_length: 255,
      },
      meta: {
        collection: "Test_Stations",
        field: "Station_Commercial_Name",
        interface: "input",
        readonly: false,
        hidden: false,
        sort: 10,
        width: "full",
        required: true,
      },
    },
    {
      collection: "Test_Stations",
      field: "Station_Type",
      type: "string",
      schema: {
        name: "Station_Type",
        table: "Test_Stations",
        schema: "public",
        data_type: "character varying",
        is_nullable: true,
        max_length: 255,
      },
      meta: {
        collection: "Test_Stations",
        field: "Station_Type",
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "Underground", value: "Underground" },
            { text: "At Grade", value: "At Grade" },
          ],
        },
        readonly: false,
        hidden: false,
        sort: 11,
        width: "full",
        required: true,
      },
    },
    {
      collection: "Test_Stations",
      field: "Station_Latitude",
      type: "string",
      schema: {
        name: "Station_Latitude",
        table: "Test_Stations",
        schema: "public",
        data_type: "character varying",
        is_nullable: true,
        max_length: 255,
      },
      meta: {
        collection: "Test_Stations",
        field: "Station_Latitude",
        interface: "input",
        readonly: false,
        hidden: false,
        sort: 12,
        width: "half",
        required: true,
      },
    },
    {
      collection: "Test_Stations",
      field: "Station_Longitude",
      type: "string",
      schema: {
        name: "Station_Longitude",
        table: "Test_Stations",
        schema: "public",
        data_type: "character varying",
        is_nullable: true,
        max_length: 255,
      },
      meta: {
        collection: "Test_Stations",
        field: "Station_Longitude",
        interface: "input",
        readonly: false,
        hidden: false,
        sort: 13,
        width: "half",
        required: true,
      },
    },
    {
      collection: "Test_Stations",
      field: "Visitors_Count",
      type: "decimal",
      schema: {
        name: "Visitors_Count",
        table: "Test_Stations",
        schema: "public",
        data_type: "numeric",
        is_nullable: true,
        numeric_precision: 10,
        numeric_scale: 0,
      },
      meta: {
        collection: "Test_Stations",
        field: "Visitors_Count",
        interface: "input",
        options: {
          min: 0,
        },
        readonly: false,
        hidden: false,
        sort: 14,
        width: "full",
        required: true,
      },
    },
    {
      collection: "Test_Stations",
      field: "Functional_Status",
      type: "string",
      schema: {
        name: "Functional_Status",
        table: "Test_Stations",
        schema: "public",
        data_type: "character varying",
        is_nullable: true,
        default_value: "Non-functional",
        max_length: 255,
      },
      meta: {
        collection: "Test_Stations",
        field: "Functional_Status",
        interface: "input",
        readonly: false,
        hidden: false,
        sort: 15,
        width: "full",
        required: false,
      },
    },
    {
      collection: "Test_Stations",
      field: "Display_Order",
      type: "integer",
      schema: {
        name: "Display_Order",
        table: "Test_Stations",
        schema: "public",
        data_type: "integer",
        is_nullable: true,
      },
      meta: {
        collection: "Test_Stations",
        field: "Display_Order",
        interface: "input",
        readonly: false,
        hidden: false,
        sort: 16,
        width: "full",
        required: false,
      },
    },
    {
      collection: "Test_Stations",
      field: "Entry_Exit_Gates",
      type: "string",
      schema: {
        name: "Entry_Exit_Gates",
        table: "Test_Stations",
        schema: "public",
        data_type: "character varying",
        is_nullable: true,
        max_length: 255,
      },
      meta: {
        collection: "Test_Stations",
        field: "Entry_Exit_Gates",
        interface: "input",
        readonly: false,
        hidden: false,
        sort: 17,
        width: "full",
        required: false,
      },
    },
    {
      collection: "Test_Stations",
      field: "Lift_Status",
      type: "string",
      schema: {
        name: "Lift_Status",
        table: "Test_Stations",
        schema: "public",
        data_type: "character varying",
        is_nullable: true,
        max_length: 255,
      },
      meta: {
        collection: "Test_Stations",
        field: "Lift_Status",
        interface: "input",
        readonly: false,
        hidden: false,
        sort: 18,
        width: "full",
        required: false,
      },
    },
  ];

  try {
    // Verify Directus connection
    await axios.get(`${directusUrl}/server/ping`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Directus server ping successful");

    // Create fields
    for (const field of fields) {
      try {
        await axios.post(`${directusUrl}/fields/Test_Stations`, field, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(`Created field: ${field.field}`);
      } catch (fieldError) {
        console.error(
          `Error creating field ${field.field}:`,
          fieldError.response ? fieldError.response.data : fieldError.message
        );
      }
    }
    console.log("All fields processed successfully!");
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

addTestStationsFields();
