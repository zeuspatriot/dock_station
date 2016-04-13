

Template.loginPage.helpers({
    createAccount: function(){
        return Session.get("isCreateAccount");
    },
    userProfile: function(){
        var profile = {
                name: "",
                role: "",
                email: "",
                pass: "",
                sector: ""
            };
        return profile;
    },
    sectors: [
        "EMEA_Travel",
        "EMEA_Retail",
        "EMEA_Media&Telco",
        "EMEA_Finance",
        "EMEA_Gaming",
        "US_Travel",
        "US_Retail",
        "US_Finance",
        "US_Media"
    ],
    roles: [
        "Dev",
        "Qc",
        "Ta"
    ]
});