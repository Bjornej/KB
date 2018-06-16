using KB.Helpers;
using KB.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace KB.Controllers
{
    public class DocsController : Controller
    {
        public DocsController(IConfiguration conf)
        {
            Configuration = conf;
        }

        private readonly IConfiguration Configuration;

        [HttpGet]
        public string Read(string path)
        {
            if (path == null) { path = "index.md"; }
            return System.IO.File.ReadAllText(Path.Combine(Constants.RepositoryFolder, path));
        }

        [HttpPost]
        public void Save([FromBody]SaveDto data)
        {
            GitHelpers.Commit(Constants.RepositoryFolder, data.Path.Replace("/","\\"), data.Content, "test", Configuration.GetValue<string>("repositoryUser", null), Configuration.GetValue<string>("password", null));
        }

        [HttpGet]
        public object GetStructure()
        {
            return RepositoryStructure.Root;
        }
    }
}