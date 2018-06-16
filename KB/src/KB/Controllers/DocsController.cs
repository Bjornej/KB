using KB.Helpers;
using KB.Models;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace KB.Controllers
{
    public class DocsController : Controller
    {
        [HttpGet]
        public bool IsInitialized()
        {
            return GitHelpers.IsInitialized(Constants.RepositoryFolder);
        }

        [HttpPost]
        public void Init()
        {
            GitHelpers.Init(Constants.RepositoryFolder);
        }

        [HttpPost]
        public void SetOrigin(string remote)
        {
            GitHelpers.AddRemote(Constants.RepositoryFolder, remote);
        }

        [HttpPost]
        public void Clone(string remote)
        {
            if (!GitHelpers.IsInitialized(Constants.RepositoryFolder))
            {
                GitHelpers.Clone(Constants.RepositoryFolder, remote);
            }
        }

        [HttpGet]
        public string Read(string path)
        {
            if (path == null) { path = "index.md"; }
            return System.IO.File.ReadAllText(Path.Combine(Constants.RepositoryFolder, path));
        }

        [HttpPost]
        public void Save([FromBody]SaveDto data)
        {
            GitHelpers.Commit(Constants.RepositoryFolder, data.Path.Replace("/","\\"), data.Content, "test");
        }

        [HttpGet]
        public object GetStructure()
        {
            return RepositoryStructure.Root;
        }
    }
}