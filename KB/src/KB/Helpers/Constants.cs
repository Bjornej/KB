using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace KB.Helpers
{
    public static class Constants
    {
        public static string RepositoryFolder
        {
            get
            {
                return Path.Combine(Environment.CurrentDirectory, "Repository");
            }

            private set { };
        }
    }
}
