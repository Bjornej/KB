using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using KB.Models;
using KB.Helpers;
using Microsoft.Extensions.Configuration;

namespace KB.Controllers
{
    public class HomeController : Controller
    {

        public HomeController(IConfiguration conf)
        {
            Configuration = conf;
        }

        private readonly IConfiguration Configuration;

        public IActionResult Index()
        {
            if (!GitHelpers.IsInitialized(Constants.RepositoryFolder))
            {
                return RedirectToAction("Initialize");
            }

            return View();
        }

        public IActionResult Initialize()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Clone(string url)
        {
            if (!GitHelpers.IsInitialized(Constants.RepositoryFolder))
            {
                GitHelpers.Clone(Constants.RepositoryFolder, url, Configuration.GetValue<string>("repositoryUser", null), Configuration.GetValue<string>("password", null));
                RepositoryStructure.Initialize();
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult Init(string url)
        {
            if (!GitHelpers.IsInitialized(Constants.RepositoryFolder))
            {
                GitHelpers.Init(Constants.RepositoryFolder);
                if (!string.IsNullOrWhiteSpace(url))
                {
                    GitHelpers.AddRemote(Constants.RepositoryFolder, url);
                    GitHelpers.Commit(Constants.RepositoryFolder, "\\index.md", "## Welcome to your new KB", "test", Configuration.GetValue<string>("repositoryUser", null), Configuration.GetValue<string>("password", null));
                    RepositoryStructure.Initialize();
                }
            }

            return RedirectToAction("Index");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
