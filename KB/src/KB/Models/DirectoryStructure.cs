using KB.Helpers;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace KB.Models
{
    public class RepositoryStructure
    {
        public static RootStructure Root { get; set; }

        public static void Initialize()
        {
            Root = new RootStructure();
            Root.Parse(Constants.RepositoryFolder);
        }
    }

    public class RootStructure
    {
        public ICollection<DirectoryStructure> Childrens { get; set; }

        public RootStructure()
        {
            Childrens = new List<DirectoryStructure>();
        }


        public void Parse(string folder)
        {
            foreach (var file in Directory.EnumerateFiles(folder, "*.md"))
            {
                Childrens.Add(DirectoryStructure.Parse(file));
            }

            Childrens = Childrens.OrderBy(x => x.Order).ToList();
        }
    }

    public class DirectoryStructure
    {
        public string Entry { get; set; }

        public string Description { get; set; }

        public int Order { get; set; }

        public ICollection<DirectoryStructure> Childrens { get; set; }

        public DirectoryStructure()
        {
            Childrens = new List<DirectoryStructure>();
        }

        public static DirectoryStructure Parse(string file)
        {
            var d = new DirectoryStructure();
            d.Entry = file.Replace(Constants.RepositoryFolder, "").Substring(1);
            d.Description = Path.GetFileNameWithoutExtension(file);
            var folder = file.Replace(".md", "");

            if (System.IO.Directory.Exists(folder))
            {
                foreach (var file2 in Directory.EnumerateFiles(folder, "*.md"))
                {
                    d.Childrens.Add(DirectoryStructure.Parse(file2));
                }
            }

            d.Childrens = d.Childrens.OrderBy(x => x.Order).ToList();

            return d;
        }
    }
}
