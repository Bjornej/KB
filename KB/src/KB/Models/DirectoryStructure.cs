using KB.Helpers;
using System.Collections.Generic;
using System.IO;

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
        public ICollection<string> Entries { get; set; }

        public ICollection<DirectoryStructure> Childrens { get; set; }

        public RootStructure()
        {
            Entries = new List<string>();
            Childrens = new List<DirectoryStructure>();
        }


        public void Parse(string folder)
        {
            foreach (var file in Directory.EnumerateFiles(folder, "*.md"))
            {
                if (Directory.Exists(Path.Combine(folder, file.Replace(".md", ""))))
                {
                    Childrens.Add(DirectoryStructure.Parse(Path.Combine(folder, file.Replace(".md", ""))));
                }
                else
                {
                    Entries.Add(file.Replace(Constants.RepositoryFolder, ""));
                }
            }
        }
    }

    public class DirectoryStructure
    {
        public string Folder { get; set; }

        public ICollection<string> Entries { get; set; }

        public ICollection<DirectoryStructure> Childrens { get; set; }

        public DirectoryStructure()
        {
            Entries = new List<string>();
            Childrens = new List<DirectoryStructure>();
        }

        public static DirectoryStructure Parse(string folder)
        {
            var d = new DirectoryStructure();
            d.Folder = folder.Replace(Constants.RepositoryFolder, "");

            foreach (var file in Directory.EnumerateFiles(folder, "*.md"))
            {
                if (Directory.Exists(Path.Combine(folder, file.Replace(".md", ""))))
                {
                    d.Childrens.Add(DirectoryStructure.Parse(Path.Combine(folder, file.Replace(".md", ""))));
                }
                else
                {
                    d.Entries.Add(file.Replace(Constants.RepositoryFolder, ""));
                }
            }

            return d;
        }
    }
}
