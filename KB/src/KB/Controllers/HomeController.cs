using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using KB.Models;
using KB.Helpers;

namespace KB.Controllers
{
    public class HomeController : Controller
    {
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
                GitHelpers.Clone(Constants.RepositoryFolder, url);
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
