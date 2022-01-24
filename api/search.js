module.exports = async (req, res) => { // this function will be launched when the API is called.
  res.status(200).json(result);
}


const result = {
    "jobnimbus": {
        "meta" : {
            "logo": "https://api.jobnimbus.kolla.dev/assets/img/logo-main.png",
            "display_name": "JobNimbus"
        },
        "results": [
            {
                "title": "Contact - Clint Berry",
                "description": "Clint Berry is a contact in JobNimbus",
                "link": "https://app.jobnimbus.com/contact/kwqtnapghyhm2cmsdvu5l51",
                "kvdata": {
                    "Phone": "8015551234"
                }
            },
            {
                "title": "Task - Lead Aging Warning",
                "description": "Lead aging warning for Clinton Sanzota",
                "link": "https://app.jobnimbus.com/task/kyqf1n6vc8su2wuukyfk0jy",
                "kvdata": {
                    "Priority": "HIGH"
                }
            }
        ]
    }
}
